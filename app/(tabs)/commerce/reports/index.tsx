// Tu página completa con las modificaciones
import { 
  Text, 
  ScrollView, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert,
  RefreshControl 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Place } from "@/types/place";
import Configuration from "@/config/constants";
import PlaceStatList from "@/components/PlaceStatList";
import { useAuth } from "@/contexts/AuthContext";
import useApi from "@/utils/useApi";

// Constante para límite de establecimientos por página
const PLACES_PER_PAGE = 3;

// Tipo para las reservas de la API
interface ApiReservation {
  ID_Reserva: number;
  Hora_Inicio: string;
  Hora_Final: string;
  Estado: string;
  Monto: number;
  Fecha_de_creacion: string;
  ID_Espacio: number;
  Codigo: string;
  Disponible: boolean;
  ID_Sucursal: number;
  Nombre: string;
  Ubicacion: string;
  Espacios_Disponibles: number;
  Precio_Parqueo: number;
  Espacios_Totales: number;
  Limite_Hora_Parqueo: number;
  ID_Comercio: number;
  Activo: boolean;
  ID: number;
  Cliente: string;
  Vehiculo: string;
}

export default function() {
  const [searchBox, setSearchBox] = useState<string>("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);
  const [displayedPlacesCount, setDisplayedPlacesCount] = useState<number>(PLACES_PER_PAGE);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalRevenue: 0,
    averageRating: 4.7,
    totalSpaces: 0,
    totalAvailableSpots: 0,
    totalEstablishments: 0,
    occupancyRate: 0,
    activeReservations: 0,
    completedReservations: 0,
    upcomingReservations: 0
  });

  const { session } = useAuth();
  const api = useApi();

  // Función para cargar las sucursales y reservas
  const loadPlaces = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener el ID del comercio desde la sesión
      const commerceId = session?.userData?.commerce?.ID_Comercio;
      
      if (!commerceId) {
        Alert.alert("Error", "No se pudo identificar el comercio");
        setLoading(false);
        return;
      }

      // Hacer peticiones paralelas para sucursales y reservas
      const [branchesResponse, bookingsResponse] = await Promise.all([
        api.get(`/api/branches/commerce/${commerceId}`),
        api.get(`/api/bookings/commerce/${commerceId}`)
      ]);

      let apiPlaces: Place[] = [];
      let allReservations: ApiReservation[] = [];
      
      // Procesar sucursales
      if (branchesResponse.data.success && branchesResponse.data.data) {
        apiPlaces = branchesResponse.data.data.map((branch: any) => {
          // Normalizar URL de Imgur
          let imageUrl = branch.Imagen;
          
          // Si es una URL de Imgur básica, convertirla a URL directa
          // if (imageUrl && imageUrl.includes('imgur.com')) {
            // Extraer el ID de la imagen
            // const parts = imageUrl.split('/');
            // const imageId = parts[parts.length - 1];
            
            // Convertir a URL directa de Imgur
            // https://imgur.com/RD3nLYG -> https://i.imgur.com/RD3nLYG.jpg
            // if (!imageUrl.includes('imgur.com')) {
            //   imageUrl = `https://imgur.com/${imageId}.jpg`;
            // }
          // }
          
          return {
            id: branch.ID_Sucursal,
            title: branch.Nombre,
            location: branch.Ubicacion,
            price: `L. ${branch.Precio_Parqueo?.toFixed(2) || "0.00"}`,
            availableSpots: branch.Espacios_Disponibles || 0,
            totalSpots: branch.Espacios_Totales || 0,
            schedule: `Límite: ${branch.Limite_Hora_Parqueo || 24} horas`,
            commerceId: branch.ID_Comercio,
            // Usar la imagen normalizada
            img: imageUrl ,
            occupancyRate: branch.Espacios_Totales > 0 
              ? Math.round(((branch.Espacios_Totales - (branch.Espacios_Disponibles || 0)) / branch.Espacios_Totales) * 100)
              : 0
          };
        });
      }

      // Procesar reservas
      if (bookingsResponse.data.success && bookingsResponse.data.data) {
        allReservations = bookingsResponse.data.data;
      }

      // Agrupar reservas por sucursal para estadísticas detalladas
      const reservationsByBranch: Record<number, ApiReservation[]> = {};
      allReservations.forEach(reservation => {
        const branchId = reservation.ID_Sucursal;
        if (!reservationsByBranch[branchId]) {
          reservationsByBranch[branchId] = [];
        }
        reservationsByBranch[branchId].push(reservation);
      });

      // Agregar estadísticas de reservas a cada sucursal
      apiPlaces = apiPlaces.map(place => {
        const branchReservations = reservationsByBranch[place.id] || [];
        const activeReservations = branchReservations.filter(r => r.Estado === 'activa' || r.Estado === 'en_curso').length;
        const completedReservations = branchReservations.filter(r => r.Estado === 'completada' || r.Estado === 'finalizada').length;
        const upcomingReservations = branchReservations.filter(r => r.Estado === 'pendiente' || r.Estado === 'confirmada').length;
        const totalReservations = branchReservations.length;
        const totalRevenue = branchReservations.reduce((sum, r) => sum + (r.Monto || 0), 0);
        
        return {
          ...place,
          totalReservations,
          totalRevenue,
          activeReservations,
          completedReservations,
          upcomingReservations
        };
      });
      
      setPlaces(apiPlaces);
      setFilteredPlaces(apiPlaces);
      setDisplayedPlaces(apiPlaces.slice(0, PLACES_PER_PAGE));
      setDisplayedPlacesCount(PLACES_PER_PAGE);
      
      // Calcular estadísticas totales usando las reservas
      calculateStatistics(allReservations, apiPlaces);
      
    } catch (error: any) {
      console.error("Error cargando establecimientos:", error);
      
      let errorMessage = "Error de conexión con el servidor";
      
      if (error.response?.status === 404) {
        errorMessage = "No se encontraron establecimientos";
      } else if (error.response?.status === 401) {
        errorMessage = "No autorizado. Por favor, inicia sesión nuevamente";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
      setPlaces([]);
      setFilteredPlaces([]);
      setDisplayedPlaces([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session, api]);

  // Función para refrescar
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPlaces();
  }, [loadPlaces]);

  // Función para calcular estadísticas totales usando reservas
  const calculateStatistics = (reservations: ApiReservation[], placesData: Place[]) => {
    // Estadísticas de sucursales
    const totalEstablishments = placesData.length;
    const totalSpaces = placesData.reduce((sum, place) => sum + (place.totalSpots || 0), 0);
    const totalAvailableSpots = placesData.reduce((sum, place) => sum + (place.availableSpots || 0), 0);
    
    // Estadísticas de reservas
    const totalReservations = reservations.length;
    
    // Filtrar reservas por estado
    const activeReservations = reservations.filter(r => 
      r.Estado === 'activa' || r.Estado === 'en_curso'
    ).length;
    
    const completedReservations = reservations.filter(r => 
      r.Estado === 'completada' || r.Estado === 'finalizada'
    ).length;
    
    const upcomingReservations = reservations.filter(r => 
      r.Estado === 'pendiente' || r.Estado === 'confirmada'
    ).length;
    
    // Calcular ingresos totales (suma de todos los montos)
    const totalRevenue = reservations.reduce((sum, reservation) => sum + (reservation.Monto || 0), 0);
    
    // Calcular tasa de ocupación basada en reservas activas vs espacios totales
    const occupancyRate = totalSpaces > 0 
      ? Math.round((activeReservations / totalSpaces) * 100)
      : 0;

    setStats({
      totalReservations,
      totalRevenue,
      averageRating: 4.7, // Valor fijo por ahora
      totalSpaces,
      totalAvailableSpots,
      totalEstablishments,
      occupancyRate,
      activeReservations,
      completedReservations,
      upcomingReservations
    });
  };

  // Filtrar lugares cuando cambia el searchBox
  useEffect(() => {
    if (searchBox.trim() === "") {
      setFilteredPlaces(places);
      setDisplayedPlaces(places.slice(0, displayedPlacesCount));
    } else {
      const filtered = places.filter(place =>
        place.title.toLowerCase().includes(searchBox.toLowerCase()) ||
        place.location.toLowerCase().includes(searchBox.toLowerCase())
      );
      setFilteredPlaces(filtered);
      setDisplayedPlaces(filtered.slice(0, displayedPlacesCount));
    }
  }, [searchBox, places, displayedPlacesCount]);

  // Cargar lugares al montar el componente
  useEffect(() => {
    if (session?.userData?.commerce?.ID_Comercio) {
      loadPlaces();
    }
  }, [session]);

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        if (session?.userData?.commerce?.ID_Comercio) {
          loadPlaces();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }, [session, loadPlaces])
  );

  // Función para cargar más establecimientos
  const loadMorePlaces = () => {
    const newCount = displayedPlacesCount + PLACES_PER_PAGE;
    setDisplayedPlacesCount(newCount);
    setDisplayedPlaces(filteredPlaces.slice(0, newCount));
  };

  // Si está cargando, mostrar indicador
  if (loading && places.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 15,
        }}
      >
        <ActivityIndicator size="large" color={ Configuration.SPOTTY_PRIMARY_COLOR } />
        <Text style={{ marginTop: 10, color: "#666" }}>Cargando estadísticas...</Text>
      </View>
    );
  }

  const totalPlaces = filteredPlaces.length;
  const hasMorePlaces = totalPlaces > displayedPlacesCount;

  return(
    <SafeAreaView style={ styles.safeArea }>
      {/* Barra de búsqueda */}
      <View style={ styles.search }>
        <Ionicons name="search" size={ 20 } color="#999" style={{ marginRight: 10 }} />
        <TextInput
          style={ styles.input }
          placeholder="Buscar establecimiento"
          placeholderTextColor="gray"
          value={ searchBox }
          onChangeText={ setSearchBox }
        />
        {searchBox.length > 0 && (
          <TouchableOpacity onPress={() => setSearchBox("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Estadísticas */}
      <View style={ styles.stats }>
        {/* Primera fila de estadísticas */}
        <View style={ styles.statsRow }>
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="business-outline" size={18} />
              <Text style={ styles.statTitle }>Establecimientos</Text>
            </View>
            <Text style={ styles.statValue }>{ stats.totalEstablishments }</Text>
          </View>
          
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="calendar-outline" size={18} />
              <Text style={ styles.statTitle }>Reservas Totales</Text>
            </View>
            <Text style={ styles.statValue }>{ stats.totalReservations }</Text>
          </View>
        </View>
        
        {/* Segunda fila de estadísticas */}
        <View style={ styles.statsRow }>
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="logo-usd" size={18} color={Configuration.SPOTTY_SECONDARY_COLOR} />
              <Text style={ styles.statTitle }>Ingresos Totales</Text>
            </View>
            <Text style={ styles.statValue }>L. { stats.totalRevenue.toLocaleString() }</Text>
          </View>
          
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="pie-chart-outline" size={18} color={Configuration.SPOTTY_SECONDARY_COLOR} />
              <Text style={ styles.statTitle }>Ocupación</Text>
            </View>
            <Text style={ styles.statValue }>{ stats.occupancyRate }%</Text>
          </View>
        </View>

        {/* Tercera fila de estadísticas */}
        <View style={ styles.statsRow }>
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="car-outline" size={18} />
              <Text style={ styles.statTitle }>Espacios Totales</Text>
            </View>
            <Text style={ styles.statValue }>{ stats.totalSpaces }</Text>
          </View>
          
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="checkmark-circle-outline" size={18} color={Configuration.SPOTTY_SECONDARY_COLOR} />
              <Text style={ styles.statTitle }>Disponibles</Text>
            </View>
            <Text style={ styles.statValue }>{ stats.totalAvailableSpots }</Text>
          </View>
        </View>

        {/* Cuarta fila de estadísticas (estados de reservas) */}
        <View style={ styles.statsRow }>
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="play-circle-outline" size={18} color="#28a745" />
              <Text style={ styles.statTitle }>Activas</Text>
            </View>
            <Text style={ [styles.statValue, { color: '#28a745' }] }>{ stats.activeReservations }</Text>
          </View>
          
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="checkmark-circle-outline" size={18} color="#6c757d" />
              <Text style={ styles.statTitle }>Completadas</Text>
            </View>
            <Text style={ [styles.statValue, { color: '#6c757d' }] }>{ stats.completedReservations }</Text>
          </View>
          
          <View style={ styles.statItem }>
            <View style={ styles.statHeader }>
              <Ionicons name="time-outline" size={18} color="#ffc107" />
              <Text style={ styles.statTitle }>Por Llegar</Text>
            </View>
            <Text style={ [styles.statValue, { color: '#ffc107' }] }>{ stats.upcomingReservations }</Text>
          </View>
        </View>
      </View>
      
      {/* Lista de lugares con paginación */}
      <ScrollView 
        style={ styles.places }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Configuration.SPOTTY_PRIMARY_COLOR]}
            tintColor={Configuration.SPOTTY_PRIMARY_COLOR}
          />
        }
      >
        <View style={ styles.sectionHeader }>
          <Text style={ styles.sectionTitle }>Mis Establecimientos</Text>
          <Text style={ styles.sectionSubtitle }>
            Mostrando {Math.min(displayedPlacesCount, totalPlaces)} de {totalPlaces}
          </Text>
        </View>
        
        {displayedPlaces.length > 0 ? (
          <>
            <PlaceStatList 
              places={ displayedPlaces } 
              onRefresh={ loadPlaces }
              
            />
            
            {/* Botón para cargar más establecimientos */}
            {hasMorePlaces && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMorePlaces}
              >
                <Text style={styles.loadMoreText}>
                  Cargar más establecimientos ({totalPlaces - displayedPlacesCount} más)
                </Text>
                <Ionicons 
                  name="chevron-down" 
                  size={20} 
                  color={Configuration.SPOTTY_PRIMARY_COLOR} 
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            )}
            
            {/* Espacio al final para mejor visualización */}
            <View style={{ height: 20 }} />
          </>
        ) : (
          <View style={ styles.emptyState }>
            <Ionicons
              name="business-outline"
              size={ 60 }
              style={{
                color: Configuration.SPOTTY_PRIMARY_COLOR,
                marginBottom: 15,
              }}
            />
            <Text style={ styles.emptyText }>
              {searchBox ? "No se encontraron resultados" : "No hay establecimientos registrados"}
            </Text>
            {!searchBox && (
              <Text style={ styles.emptySubtext }>
                Agrega tu primer establecimiento para comenzar
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
  },
  stats: {
    gap: 10,
    marginTop: 15,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statValue: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 5,
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statItem: {
    flex: 1,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    padding: 15,
  },
  places: {
    flex: 1,
    marginTop: 20,
  },
  sectionHeader: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Configuration.SPOTTY_PRIMARY_COLOR,
  },
  loadMoreText: {
    color: Configuration.SPOTTY_PRIMARY_COLOR,
    fontWeight: "bold",
    fontSize: 16,
  },
});