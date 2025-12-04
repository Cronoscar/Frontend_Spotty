import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "expo-router";
import { PlaceStats } from "@/types/placeStat";
import Configuration from "@/config/constants";
import { useAuth } from "@/contexts/AuthContext";
import useApi from "@/utils/useApi";

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
  const [stats, setStats] = useState<PlaceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState<boolean>(true);
  const [branchInfo, setBranchInfo] = useState<any>(null);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const branchId = params.id ? Number(params.id) : null;
  
  const { session } = useAuth();
  const api = useApi();

  // Función para cargar reservas y datos de la sucursal
  const loadBranchData = useCallback(async () => {
    if (!branchId) {
      Alert.alert("Error", "No se pudo identificar la sucursal");
      setLoading(false);
      setReservationsLoading(false);
      return;
    }

    try {
      setReservationsLoading(true);
      
      // Obtener reservas de la sucursal
      const reservationsResponse = await api.get(`/api/bookings/branch/${branchId}`);
      
      if (reservationsResponse.data.success && reservationsResponse.data.data) {
        const reservationsData = reservationsResponse.data.data;
        setReservations(reservationsData);
        
        // Si hay reservas, obtener información de la sucursal del primer elemento
        if (reservationsData.length > 0) {
          const firstReservation = reservationsData[0];
          setBranchInfo({
            id: firstReservation.ID_Sucursal,
            nombre: firstReservation.Nombre,
            ubicacion: firstReservation.Ubicacion,
            espaciosDisponibles: firstReservation.Espacios_Disponibles,
            espaciosTotales: firstReservation.Espacios_Totales,
            precioParqueo: firstReservation.Precio_Parqueo,
            limiteHoraParqueo: firstReservation.Limite_Hora_Parqueo,
            activo: firstReservation.Activo,
            idComercio: firstReservation.ID_Comercio
          });
          
          // Calcular estadísticas
          calculateStatistics(reservationsData, firstReservation);
        } else {
          // Si no hay reservas, necesitamos obtener la información de la sucursal de otro endpoint
          // Por ahora, usamos datos por defecto
          setBranchInfo({
            id: branchId,
            nombre: "Sucursal",
            ubicacion: "Ubicación no disponible",
            espaciosDisponibles: 0,
            espaciosTotales: 0,
            precioParqueo: 0,
            limiteHoraParqueo: 24,
            activo: true,
            idComercio: session?.userData?.commerce?.ID_Comercio
          });
          
          // Estadísticas por defecto sin reservas
          setStats({
            id: branchId,
            title: "Sucursal",
            location: "Ubicación no disponible",
            totalBookings: 0,
            totalIncome: 0,
            avgRating: 0,
            availableSpots: 0,
            totalSpots: 0,
            schedule: "08:00 AM - 10:00 PM",
            price: 0
          });
        }
      } else {
        // Sin reservas, establecer datos por defecto
        setReservations([]);
        setBranchInfo({
          id: branchId,
          nombre: "Sucursal",
          ubicacion: "Ubicación no disponible",
          espaciosDisponibles: 0,
          espaciosTotales: 0,
          precioParqueo: 0,
          limiteHoraParqueo: 24,
          activo: true,
          idComercio: session?.userData?.commerce?.ID_Comercio
        });
        
        setStats({
          id: branchId,
          title: "Sucursal",
          location: "Ubicación no disponible",
          totalBookings: 0,
          totalIncome: 0,
          avgRating: 0,
          availableSpots: 0,
          totalSpots: 0,
          schedule: "08:00 AM - 10:00 PM",
          price: 0
        });
      }
    } catch (error: any) {
      console.error("Error cargando datos de la sucursal:", error);
      
      let errorMessage = "Error de conexión con el servidor";
      
      if (error.response?.status === 404) {
        errorMessage = "No se encontró la sucursal o no tiene reservas";
      } else if (error.response?.status === 401) {
        errorMessage = "No autorizado. Por favor, inicia sesión nuevamente";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      setReservationsLoading(false);
    }
  }, [branchId, session, api]);

  // Función para calcular estadísticas
  const calculateStatistics = (reservationsData: ApiReservation[], branchData: any) => {
    // Calcular total de reservas
    const totalBookings = reservationsData.length;
    
    // Calcular ingresos totales (suma de todos los montos)
    const totalIncome = reservationsData.reduce((sum, reservation) => sum + (reservation.Monto || 0), 0);
    
    // Calcular valoración promedio (por ahora es fija, pero podría venir de otro endpoint)
    // En un sistema real, esto vendría de valoraciones de clientes
    const avgRating = calculateAverageRating(reservationsData);
    
    // Obtener datos de la sucursal
    const availableSpots = branchData.Espacios_Disponibles || 0;
    const totalSpots = branchData.Espacios_Totales || 0;
    
    // Calcular horario basado en el límite de horas
    const schedule = `Límite: ${branchData.Limite_Hora_Parqueo || 24} horas`;
    
    // Precio por hora
    const price = branchData.Precio_Parqueo || 0;
    
    setStats({
      id: branchData.ID_Sucursal,
      title: branchData.Nombre,
      location: branchData.Ubicacion,
      totalBookings,
      totalIncome,
      avgRating,
      availableSpots,
      totalSpots,
      schedule,
      price
    });
  };

  // Función para calcular la valoración promedio (simulada por ahora)
  const calculateAverageRating = (reservations: ApiReservation[]): number => {
    if (reservations.length === 0) return 0;
    
    // En un sistema real, esto vendría de una tabla de valoraciones
    // Por ahora, simulamos una valoración basada en el número de reservas completadas
    const completedReservations = reservations.filter(r => 
      r.Estado === 'completada' || r.Estado === 'finalizada'
    ).length;
    
    // Base de 4.0 más un bonus por completitud
    const baseRating = 4.0;
    const completenessBonus = completedReservations > 0 ? 0.8 : 0;
    
    return Math.min(baseRating + completenessBonus, 5.0);
  };

  // Cargar datos al montar
  useEffect(() => {
    if (branchId) {
      loadBranchData();
    }
  }, [branchId]);

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      if (branchId) {
        const timer = setTimeout(() => {
          loadBranchData();
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }, [branchId, loadBranchData])
  );

  // Función para formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calcular estadísticas detalladas de reservas
  const calculateReservationStats = () => {
    if (reservations.length === 0) {
      return {
        active: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        totalAmount: 0
      };
    }

    const active = reservations.filter(r => r.Estado === 'activa' || r.Estado === 'en_curso').length;
    const completed = reservations.filter(r => r.Estado === 'completada' || r.Estado === 'finalizada').length;
    const pending = reservations.filter(r => r.Estado === 'pendiente' || r.Estado === 'confirmada').length;
    const cancelled = reservations.filter(r => r.Estado === 'cancelada').length;
    const totalAmount = reservations.reduce((sum, r) => sum + (r.Monto || 0), 0);

    return { active, completed, pending, cancelled, totalAmount };
  };

  const reservationStats = calculateReservationStats();

  if (loading || !stats) {
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

  return (
    <SafeAreaView style={ styles.safeArea }>
      {/* BOTÓN DE REGRESO MODIFICADO PARA IR A /commerce/reports */}
      <TouchableOpacity
        style={{ alignSelf: "flex-start", paddingBottom: 10, }}
        onPress={ () => router.push('/commerce/reports') }
      >
        <Ionicons
          style={ styles.backButton }
          name="arrow-back-outline"
          size={ 20 }
        />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={ styles.container }>
        <Text style={ styles.title }>{ stats.title }</Text>
        <View style={ styles.location }>
          <Ionicons name="location-outline" size={ 20 } />
          <Text>{ stats.location }</Text>
        </View>
        
        {/* Estadísticas de reservas */}
        <View style={ statCardStyle.container }>
          <Ionicons name="calendar-outline" style={{ ...statCardStyle.icon, color: "gray", backgroundColor: "lightgray" }} />
          <Text>Total Reservas</Text>
          <Text style={ statCardStyle.statValue }>{ stats.totalBookings }</Text>
          
          {/* Desglose de reservas */}
          {stats.totalBookings > 0 && (
            <View style={styles.reservationBreakdown}>
              <View style={styles.breakdownRow}>
                <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
                <Text style={styles.breakdownText}>Activas: {reservationStats.active}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <View style={[styles.statusDot, { backgroundColor: '#6c757d' }]} />
                <Text style={styles.breakdownText}>Completadas: {reservationStats.completed}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <View style={[styles.statusDot, { backgroundColor: '#ffc107' }]} />
                <Text style={styles.breakdownText}>Pendientes: {reservationStats.pending}</Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Ingresos totales */}
        <View style={ statCardStyle.container }>
          <Ionicons name="logo-usd" style={{ ...statCardStyle.icon, color: "green", backgroundColor: "lightgreen" }} />
          <Text>Ingresos totales</Text>
          <Text style={ statCardStyle.statValue }>
            { formatCurrency(stats.totalIncome) }
          </Text>
          
          {/* Desglose por estado */}
          {stats.totalBookings > 0 && (
            <View style={styles.incomeBreakdown}>
              <Text style={styles.breakdownLabel}>Ingresos por estado:</Text>
              <Text style={styles.breakdownDetail}>• Activas: {formatCurrency(reservations
                .filter(r => r.Estado === 'activa' || r.Estado === 'en_curso')
                .reduce((sum, r) => sum + (r.Monto || 0), 0)
              )}</Text>
              <Text style={styles.breakdownDetail}>• Completadas: {formatCurrency(reservations
                .filter(r => r.Estado === 'completada' || r.Estado === 'finalizada')
                .reduce((sum, r) => sum + (r.Monto || 0), 0)
              )}</Text>
            </View>
          )}
        </View>
        
        {/* Valoración promedio */}
        <View style={ statCardStyle.container }>
          <Ionicons name="star-outline" style={{ ...statCardStyle.icon, color: Configuration.SPOTTY_SECONDARY_COLOR, backgroundColor: "#fff" }} />
          <Text>Valoración promedio</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...statCardStyle.statValue, marginRight: 10, }}>
              { stats.avgRating.toFixed(1) }
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {
                [...Array(Math.floor(stats.avgRating)).keys()]
                  .map((_, idx) => (
                    <Ionicons key={ idx } name="star" color={ Configuration.SPOTTY_SECONDARY_COLOR } size={ 20 } />
                  ))
              }
              {stats.avgRating % 1 !== 0 && (
                <Ionicons name="star-half" color={ Configuration.SPOTTY_SECONDARY_COLOR } size={ 20 } />
              )}
            </View>
          </View>
          <Text style={styles.ratingNote}>
            Basado en {stats.totalBookings} reservas
          </Text>
        </View>
        
        {/* Ocupación actual */}
        <View style={ statCardStyle.container }>
          <Ionicons name="pie-chart-outline" style={{ ...statCardStyle.icon, color: Configuration.SPOTTY_SECONDARY_COLOR, backgroundColor: "#fff" }} />
          <Text>Ocupación actual</Text>
          <Text style={ statCardStyle.statValue }>{ stats.totalSpots - stats.availableSpots }/{ stats.totalSpots }</Text>
          
          {/* Barra de progreso de ocupación */}
          <View style={styles.occupancyBarContainer}>
            <View style={[
              styles.occupancyBar, 
              { 
                width: `${((stats.totalSpots - stats.availableSpots) / stats.totalSpots) * 100}%`,
                backgroundColor: ((stats.totalSpots - stats.availableSpots) / stats.totalSpots) > 0.8 ? '#dc3545' : 
                               ((stats.totalSpots - stats.availableSpots) / stats.totalSpots) > 0.5 ? '#ffc107' : '#28a745'
              }
            ]} />
          </View>
          <Text style={styles.occupancyPercentage}>
            {Math.round(((stats.totalSpots - stats.availableSpots) / stats.totalSpots) * 100)}% de ocupación
          </Text>
        </View>
        
        {/* Configuración de la sucursal */}
        <View style={ styles.placeConfig }>
          <Text style={{ fontWeight: "bold", fontSize: 20, }}>Configuración</Text>
          <View style={ styles.placeConfigItem }>
            <Text style={ styles.placeConfigItemText }>Precio por hora</Text>
            <Text style={ styles.placeConfigItemText }>{ formatCurrency(stats.price) }</Text>
          </View>
          <View style={ styles.placeConfigItem }>
            <Text style={ styles.placeConfigItemText }>Horario de parqueo</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Ionicons name="time-outline" style={ styles.placeConfigItemText} />
              <Text style={ styles.placeConfigItemText }>{ stats.schedule }</Text>
            </View>
          </View>
          <View style={ styles.placeConfigItem }>
            <Text style={ styles.placeConfigItemText }>Total espacios</Text>
            <Text style={ styles.placeConfigItemText }>{ stats.totalSpots }</Text>
          </View>
          <View style={ styles.placeConfigItem }>
            <Text style={ styles.placeConfigItemText }>Espacios disponibles</Text>
            <Text style={[styles.placeConfigItemText, 
              { color: stats.availableSpots === 0 ? '#dc3545' : stats.availableSpots < 5 ? '#ffc107' : '#28a745' }
            ]}>
              { stats.availableSpots }
            </Text>
          </View>
          {branchInfo && (
            <View style={ styles.placeConfigItem }>
              <Text style={ styles.placeConfigItemText }>Estado</Text>
              <Text style={[styles.placeConfigItemText, 
                { color: branchInfo.activo ? '#28a745' : '#dc3545' }
              ]}>
                { branchInfo.activo ? 'Activo' : 'Inactivo' }
              </Text>
            </View>
          )}
        </View>
        
        {/* Cobrar ingresos */}
        <View style={ withdrawStyles.container }>
          <View style={ withdrawStyles.header }>
            <Ionicons name="wallet-outline" size={26} color="#4CAF50" />
            <View>
              <Text style={ withdrawStyles.headerTitle }>Cobrar Ingresos</Text>
              <Text style={ withdrawStyles.headerSubtitle }>Retira tus ganancias a tu cuenta bancaria</Text>
            </View>
          </View>

          {/* Datos */}
          <View style={ withdrawStyles.row }>
            <Text style={ withdrawStyles.label }>Ingresos generados</Text>
            <Text style={ withdrawStyles.value }>
              { formatCurrency(stats.totalIncome) }
            </Text>
          </View>

          <View style={ withdrawStyles.row }>
            <Text style={ withdrawStyles.label }>Comisión Spotty (5%)</Text>
            <Text style={ withdrawStyles.commission }>
              -{ formatCurrency(stats.totalIncome * 0.05) }
            </Text>
          </View>

          {/* Monto final */}
          <Text style={ withdrawStyles.receiveLabel }>Monto a recibir</Text>
          <Text style={ withdrawStyles.receiveValue }>
            { formatCurrency(stats.totalIncome * 0.95) }
          </Text>

          {/* Botón */}
          <TouchableOpacity 
            style={[
              withdrawStyles.button,
              stats.totalIncome === 0 && withdrawStyles.buttonDisabled
            ]}
            disabled={stats.totalIncome === 0}
          >
            <Ionicons name="card-outline" size={20} color="#fff" />
            <Text style={ withdrawStyles.buttonText }>
              {stats.totalIncome === 0 ? 'Sin fondos disponibles' : `Cobrar ${formatCurrency(stats.totalIncome * 0.95)}`}
            </Text>
          </TouchableOpacity>

          <View style={ withdrawStyles.footer }>
            <Ionicons name="checkmark-circle" size={18} color="green" />
            <Text style={ withdrawStyles.footerText }>Transferencia en 2–3 días hábiles</Text>
          </View>
        </View>

        {/* Información de reservas recientes */}
        {reservations.length > 0 && (
          <View style={styles.recentReservations}>
            <Text style={styles.recentTitle}>Reservas recientes ({reservations.length})</Text>
            <View style={styles.reservationList}>
              {reservations.slice(0, 3).map((reservation) => (
                <View key={reservation.ID_Reserva} style={styles.reservationItem}>
                  <View style={styles.reservationHeader}>
                    <Text style={styles.reservationCode}>Espacio {reservation.Codigo}</Text>
                    <View style={[
                      styles.statusBadge,
                      { 
                        backgroundColor: reservation.Estado === 'activa' ? 'rgba(40, 167, 69, 0.1)' :
                                      reservation.Estado === 'completada' ? 'rgba(108, 117, 125, 0.1)' :
                                      'rgba(255, 193, 7, 0.1)'
                      }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { 
                          color: reservation.Estado === 'activa' ? '#28a745' :
                                reservation.Estado === 'completada' ? '#6c757d' :
                                '#ffc107'
                        }
                      ]}>
                        {reservation.Estado}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reservationDetails}>
                    <Text style={styles.reservationClient}>{reservation.Cliente}</Text>
                    <Text style={styles.reservationVehicle}>{reservation.Vehiculo}</Text>
                    <Text style={styles.reservationAmount}>{formatCurrency(reservation.Monto)}</Text>
                  </View>
                </View>
              ))}
            </View>
            {reservations.length > 3 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => {
                  // Aquí podrías navegar a una pantalla con todas las reservas
                  Alert.alert("Todas las reservas", `Total de reservas: ${reservations.length}`);
                }}
              >
                <Text style={styles.viewAllText}>Ver todas las reservas</Text>
                <Ionicons name="chevron-forward" size={16} color={Configuration.SPOTTY_PRIMARY_COLOR} />
              </TouchableOpacity>
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
  backButton: {
    backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
    color: Configuration.SPOTTY_PRIMARY_COLOR,
    borderRadius: 100,
    padding: 10,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  placeConfig: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 25,
    marginHorizontal: 15,
    backgroundColor: "#f5f5f5",
  },
  placeConfigItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    alignItems: "center"
  },
  placeConfigItemText: {
    fontSize: 13,
  },
  // Estilos para desglose de reservas
  reservationBreakdown: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  breakdownText: {
    fontSize: 12,
    color: '#666',
  },
  // Estilos para desglose de ingresos
  incomeBreakdown: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  breakdownLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  breakdownDetail: {
    fontSize: 11,
    color: '#666',
    marginVertical: 2,
  },
  // Estilos para valoración
  ratingNote: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  // Estilos para barra de ocupación
  occupancyBarContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  occupancyBar: {
    height: '100%',
    borderRadius: 4,
  },
  occupancyPercentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  // Estilos para reservas recientes
  recentReservations: {
    marginTop: 25,
    marginHorizontal: 15,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  reservationList: {
    gap: 8,
  },
  reservationItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reservationCode: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  reservationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservationClient: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  reservationVehicle: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 10,
  },
  reservationAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#28a745',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  viewAllText: {
    color: Configuration.SPOTTY_PRIMARY_COLOR,
    fontWeight: '600',
    marginRight: 5,
  },
});

const statCardStyle = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 15,
    backgroundColor: "#f5f5f5",
  },
  icon: {
    fontSize: 20,
    padding: 10,
    margin: 5,
    borderRadius: 100,
    alignSelf: "flex-start"
  },
  statValue: {
    fontWeight: "bold",
    fontSize: 25,
  }
});

const withdrawStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#d9ead3",
    backgroundColor: "#f1f8f5",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#333"
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000"
  },
  commission: {
    fontSize: 14,
    color: "red",
    fontWeight: "600"
  },
  receiveLabel: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333"
  },
  receiveValue: {
    fontSize: 24,
    color: "#2e7d32",
    fontWeight: "bold",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1F3C88",
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5
  },
  footerText: {
    color: "green",
    fontSize: 12
  }
});