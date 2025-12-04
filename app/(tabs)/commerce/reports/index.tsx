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
		averageRating: 4.7, // Por defecto
		totalSpaces: 0,
		totalAvailableSpots: 0,
		totalEstablishments: 0,
		occupancyRate: 0
	});

	const { session } = useAuth();
	const api = useApi();

	// Función para cargar las sucursales
	const loadPlaces = useCallback(async () => {
		try {
			setLoading(true);
			
			// Obtener el ID del comercio desde la sesión
			const local = localStorage.getItem('session');
		const data= JSON.parse(local || '{}');
		const commerceId = data.userData.commerce.ID_Comercio;
			
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
					// Datos adicionales para estadísticas
					totalReservations: branch.Total_Reservaciones || 0,
					totalRevenue: branch.Ingresos_Totales || 0,
					rating: branch.Valoracion_Promedio || 4.7,
					// Datos para imágenes
					img: branch.Imagen || `https://via.placeholder.com/300x200/cccccc/969696?text=${encodeURIComponent(branch.Nombre.substring(0, 10))}`,
					// Calcular ocupación individual
					occupancyRate: branch.Espacios_Totales > 0 
						? Math.round(((branch.Espacios_Totales - (branch.Espacios_Disponibles || 0)) / branch.Espacios_Totales) * 100)
						: 0
				}));
				
				setPlaces(apiPlaces);
				setFilteredPlaces(apiPlaces);
				// Inicializar con las primeras sucursales
				setDisplayedPlaces(apiPlaces.slice(0, PLACES_PER_PAGE));
				setDisplayedPlacesCount(PLACES_PER_PAGE);
				
				// Calcular estadísticas totales
				calculateStatistics(apiPlaces);
			} else {
				// Si no hay datos, establecer arrays vacíos
				setPlaces([]);
				setFilteredPlaces([]);
				setDisplayedPlaces([]);
				setStats({
					totalReservations: 0,
					totalRevenue: 0,
					averageRating: 4.7,
					totalSpaces: 0,
					totalAvailableSpots: 0,
					totalEstablishments: 0,
					occupancyRate: 0
				});
			}
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

	// Función para calcular estadísticas
	const calculateStatistics = (placesData: Place[]) => {
		const totalEstablishments = placesData.length;
		const totalSpaces = placesData.reduce((sum, place) => sum + (place.totalSpots || 0), 0);
		const totalAvailableSpots = placesData.reduce((sum, place) => sum + (place.availableSpots || 0), 0);
		const totalReservations = placesData.reduce((sum, place: any) => sum + (place.totalReservations || 0), 0);
		const totalRevenue = placesData.reduce((sum, place: any) => sum + (place.totalRevenue || 0), 0);
		
		// Calcular promedio de rating
		const placesWithRating = placesData.filter((place: any) => place.rating);
		const averageRating = placesWithRating.length > 0 
			? placesWithRating.reduce((sum, place: any) => sum + place.rating, 0) / placesWithRating.length
			: 4.7;
		
		// Calcular tasa de ocupación
		const occupancyRate = totalSpaces > 0 
			? ((totalSpaces - totalAvailableSpots) / totalSpaces * 100)
			: 0;

		setStats({
			totalReservations,
			totalRevenue,
			averageRating,
			totalSpaces,
			totalAvailableSpots,
			totalEstablishments,
			occupancyRate: Math.round(occupancyRate)
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
							<Ionicons name="logo-usd" size={18} />
							<Text style={ styles.statTitle }>Ingresos</Text>
						</View>
						<Text style={ styles.statValue }>${ stats.totalRevenue.toLocaleString() }</Text>
					</View>
				</View>
				
				{/* Segunda fila de estadísticas */}
				<View style={ styles.statsRow }>
					<View style={ styles.statItem }>
						<View style={ styles.statHeader }>
							<Ionicons name="star-outline" size={18} color={ Configuration.SPOTTY_SECONDARY_COLOR } />
							<Text style={ styles.statTitle }>Valoración</Text>
						</View>
						<View style={{ flexDirection: "row", alignItems: "center", gap: 5, }}>
							<Text style={ styles.statValue }>{ stats.averageRating.toFixed(1) }</Text>
							<Ionicons name="star" size={ 15 } color={ Configuration.SPOTTY_SECONDARY_COLOR } />
						</View>
					</View>
					
					<View style={ styles.statItem }>
						<View style={ styles.statHeader }>
							<Ionicons name="pie-chart-outline" size={18} color={ Configuration.SPOTTY_SECONDARY_COLOR } />
							<Text style={ styles.statTitle }>Ocupación</Text>
						</View>
						<Text style={ styles.statValue }>{ stats.occupancyRate }%</Text>
					</View>
				</View>

				{/* Tercera fila de estadísticas (opcional) */}
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
							<Ionicons name="checkmark-circle-outline" size={18} color={ Configuration.SPOTTY_SECONDARY_COLOR } />
							<Text style={ styles.statTitle }>Disponibles</Text>
						</View>
						<Text style={ styles.statValue }>{ stats.totalAvailableSpots }</Text>
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
						<PlaceStatList places={ displayedPlaces } onRefresh={ loadPlaces } />
						
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