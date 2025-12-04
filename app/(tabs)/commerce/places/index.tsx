import { 
  Text, 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  RefreshControl,
  ScrollView 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";

import PlaceList from "@/components/PlaceList";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useAuth } from "@/contexts/AuthContext";
import useApi from "@/utils/useApi";
import Configuration from "@/config/constants";
import { Place } from "@/types/place";

// Constante para límite de establecimientos por página
const PLACES_PER_PAGE = 3;

export default function() {
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [places, setPlaces] = useState<Place[]>([]);
    const [searchBox, setSearchBox] = useState<string>("");
    const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [displayedPlacesCount, setDisplayedPlacesCount] = useState<number>(PLACES_PER_PAGE);
    const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);

    const { session } = useAuth();
    const api = useApi();
    const router = useRouter();

    // Usar useAuthStatus solo para protección de ruta (sin función)
    useAuthStatus();

    // Función para cargar lugares desde la API
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

            // Hacer la petición a la API
            const response = await api.get(`/api/branches/commerce/${commerceId}`);
            
            if (response.data.success && response.data.data) {
                // Mapear los datos de la API al formato Place
                const apiPlaces: Place[] = response.data.data.map((branch: any) => ({
                    id: branch.ID_Sucursal,
                    title: branch.Nombre,
                    location: branch.Ubicacion,
                    price: `L. ${branch.Precio_Parqueo?.toFixed(2) || "0.00"}`,
                    availableSpots: branch.Espacios_Disponibles || 0,
                    totalSpots: branch.Espacios_Totales || 0,
                    schedule: `Límite: ${branch.Limite_Hora_Parqueo || 24} horas`,
                    commerceId: branch.ID_Comercio,
                    // Datos adicionales para imágenes
                    img: branch.Imagen || `https://via.placeholder.com/300x200/cccccc/969696?text=${encodeURIComponent(branch.Nombre.substring(0, 10))}`,
                    // Calcular ocupación
                    occupancyRate: branch.Espacios_Totales > 0 
                        ? Math.round(((branch.Espacios_Totales - (branch.Espacios_Disponibles || 0)) / branch.Espacios_Totales) * 100)
                        : 0
                }));
                
                setPlaces(apiPlaces);
                setFilteredPlaces(apiPlaces);
                // Inicializar con las primeras sucursales
                setDisplayedPlaces(apiPlaces.slice(0, PLACES_PER_PAGE));
                setDisplayedPlacesCount(PLACES_PER_PAGE);
            } else {
                Alert.alert("Información", "No tienes establecimientos registrados");
                setPlaces([]);
                setFilteredPlaces([]);
                setDisplayedPlaces([]);
            }
        } catch (error: any) {
            console.error("Error cargando establecimientos:", error);
            
            let errorMessage = "Error de conexión con el servidor";
            
            if (error.response?.status === 404) {
                errorMessage = "No se encontraron establecimientos para este comercio";
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
            setHasLoaded(true);
        }
    }, [session, api]);

    // Función para refrescar
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadPlaces();
    }, [loadPlaces]);

    // Cargar lugares al montar el componente
    useEffect(() => {
        if (!hasLoaded && session?.userData?.commerce?.ID_Comercio) {
            loadPlaces();
        }
    }, [session, hasLoaded, loadPlaces]);

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

    // Función para cargar más establecimientos
    const loadMorePlaces = () => {
        const newCount = displayedPlacesCount + PLACES_PER_PAGE;
        setDisplayedPlacesCount(newCount);
        setDisplayedPlaces(filteredPlaces.slice(0, newCount));
    };

    if (loading && !hasLoaded) {
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
                <Text style={{ marginTop: 10, color: "#666" }}>Cargando establecimientos...</Text>
            </View>
        );
    }

    const totalPlaces = filteredPlaces.length;
    const hasMorePlaces = totalPlaces > displayedPlacesCount;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={ styles.header }>
                <View>
                    <Text style={ styles.title }>Mis Establecimientos</Text>
                    <Text style={ styles.subtitle }>Gestiona tus espacios de parqueo</Text>
                </View>
                <TouchableOpacity
                    onPress={ () => router.push("/commerce/places/newPlace") }
                    style={ styles.addButton }
                >
                    <Text style={ styles.buttonText }>+ Agregar</Text>
                </TouchableOpacity>
            </View>
            
            {
                filteredPlaces.length === 0
                    ? <NoPlaces onRefresh={loadPlaces} />
                    : (
                        <>
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
                            
                            {/* Contador de resultados */}
                            <View style={styles.resultsCount}>
                                <Text style={styles.resultsText}>
                                    Mostrando {Math.min(displayedPlacesCount, totalPlaces)} de {totalPlaces} establecimientos
                                </Text>
                            </View>
                            
                            {/* ScrollView con RefreshControl */}
                            <ScrollView 
                                style={{ flex: 1 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={[Configuration.SPOTTY_PRIMARY_COLOR]}
                                        tintColor={Configuration.SPOTTY_PRIMARY_COLOR}
                                    />
                                }
                            >
                                {/* Usar tu PlaceList con los lugares mostrados */}
                                <PlaceList 
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
                            </ScrollView>
                        </>
                    )
            }
        </SafeAreaView>
    );
}

// Componente NoPlaces actualizado
function NoPlaces({ onRefresh }: { onRefresh: () => void }) {
    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
            }}
        >
            <Ionicons
                name="location-outline"
                size={ 100 }
                style={{
                    color: "#fff",
                    borderRadius: 100,
                    backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
                    padding: 20,
                    marginBottom: 20,
                }}
            />
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 22,
                    textAlign: "center",
                    marginBottom: 10,
                }}
            >
                No hay establecimientos registrados
            </Text>
            <Text
                style={{
                    color: "gray",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 25,
                }}
            >
                Comienza agregando tu primer establecimiento
            </Text>
            <TouchableOpacity
                onPress={ () => router.push("/commerce/places/newPlace") }
                style={[styles.addButton, { paddingHorizontal: 25, paddingVertical: 12 }]}
            >
                <Text style={ styles.buttonText }>+ Agregar Establecimiento</Text>
            </TouchableOpacity>
            
            {/* Botón para recargar */}
            <TouchableOpacity
                onPress={onRefresh}
                style={[styles.refreshButton]}
            >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.refreshText}>Reintentar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        marginTop: 10,
        marginHorizontal: 15,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
    subtitle: {
        fontSize: 15,
        color: "gray",
        marginVertical: 5,
    },
    addButton: {
        backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    search: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 15,
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 5,
        fontSize: 16,
    },
    refreshButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
    },
    refreshText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 5,
        fontSize: 14,
    },
    resultsCount: {
        paddingHorizontal: 20,
        marginBottom: 10,
        alignItems: "center",
    },
    resultsText: {
        color: "#666",
        fontSize: 14,
        fontStyle: "italic",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    loadMoreButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        marginHorizontal: 15,
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