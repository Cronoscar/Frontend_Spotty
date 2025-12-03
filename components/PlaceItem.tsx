// components/PlaceItem.tsx
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PlaceItemProps } from "@/types/component";
import PlaceImage from "@/assets/images/commerce.png";
import Configuration from "@/config/constants";

export default function PlaceItem({
	id,
	title,
	location,
	price,
	availableSpots,
	totalSpots,
	schedule = "", // Prop opcional para horario/límite
	commerceId
}: PlaceItemProps & { schedule?: string; commerceId?: number }) {
	const router = useRouter();
	
	// Calcular porcentaje de disponibilidad
	const availabilityPercentage = (availableSpots / totalSpots) * 100;
	
	// Determinar color según disponibilidad
	const getAvailabilityColor = () => {
		if (availabilityPercentage > 50) return "#4CAF50"; // Verde
		if (availabilityPercentage > 20) return "#FF9800"; // Naranja
		return "#F44336"; // Rojo
	};
	
	// Función para manejar la gestión de espacios
	const handleManageSpaces = () => {
		router.push(`/commerce/places/${id}/manage`);
	};
	
	// Función para eliminar establecimiento (con confirmación)
	const handleDelete = () => {
		Alert.alert(
			"Eliminar Establecimiento",
			`¿Estás seguro de que deseas eliminar "${title}"? Esta acción no se puede deshacer.`,
			[
				{ text: "Cancelar", style: "cancel" },
				{ 
					text: "Eliminar", 
					style: "destructive",
					onPress: () => {
						// Aquí iría la lógica para eliminar el establecimiento
						Alert.alert("Éxito", `Establecimiento "${title}" eliminado.`);
					}
				}
			]
		);
	};
	
	// Función para ver detalles
	const handleViewDetails = () => {
		router.push(`/commerce/places/${id}`);
	};

	return (
		<TouchableOpacity 
			style={styles.place} 
			onPress={handleViewDetails}
			activeOpacity={0.9}
		>
			<View style={styles.header}>
				<View style={styles.imageContainer}>
					<Image
						source={PlaceImage}
						style={styles.image}
						resizeMode="cover"
					/>
					{/* Badge de disponibilidad */}
					<View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor() }]}>
						<Text style={styles.availabilityBadgeText}>
							{availableSpots}/{totalSpots}
						</Text>
					</View>
				</View>
				<View style={styles.placeInfo}>
					<Text style={styles.title} numberOfLines={1}>{title}</Text>
					<View style={styles.locationContainer}>
						<Ionicons name="location-outline" size={14} color="#666" />
						<Text style={styles.location} numberOfLines={1}>
							{location}
						</Text>
					</View>
					
					{/* Información de precios y horario */}
					<View style={styles.detailsContainer}>
						<View style={styles.detailItem}>
							<Ionicons name="pricetag-outline" size={14} color="#666" />
							<Text style={styles.price}>{price}</Text>
						</View>
						{schedule ? (
							<View style={styles.detailItem}>
								<Ionicons name="time-outline" size={14} color="#666" />
								<Text style={styles.schedule}>{schedule}</Text>
							</View>
						) : null}
					</View>
					
					{/* Barra de progreso de disponibilidad */}
					<View style={styles.availabilityBarContainer}>
						<View style={styles.availabilityBarBackground}>
							<View 
								style={[
									styles.availabilityBarFill, 
									{ 
										width: `${availabilityPercentage}%`,
										backgroundColor: getAvailabilityColor()
									}
								]} 
							/>
						</View>
						<Text style={styles.availabilityText}>
							{availabilityPercentage.toFixed(0)}% disponible
						</Text>
					</View>
				</View>
			</View>
			
			{/* Botones de acción */}
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={[styles.button, styles.manageButton]}
					onPress={handleManageSpaces}
				>
					<Ionicons name="create-outline" size={18} color="#fff" />
					<Text style={styles.buttonText}>Gestionar</Text>
				</TouchableOpacity>
				
				<TouchableOpacity
					style={[styles.button, styles.editButton]}
					onPress={() => router.push(`/commerce/places/${id}/edit`)}
				>
					<Ionicons name="settings-outline" size={18} color="#fff" />
					<Text style={styles.buttonText}>Editar</Text>
				</TouchableOpacity>
				
				<TouchableOpacity
					style={[styles.button, styles.deleteButton]}
					onPress={handleDelete}
				>
					<Ionicons name="trash-outline" size={18} color="#fff" />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	place: {
		marginVertical: 8,
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	header: {
		flexDirection: "row",
	},
	imageContainer: {
		position: "relative",
		marginRight: 12,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 8,
	},
	availabilityBadge: {
		position: "absolute",
		top: 8,
		right: 8,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	availabilityBadgeText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "bold",
	},
	placeInfo: {
		flex: 1,
		gap: 8,
	},
	title: {
		fontWeight: "bold",
		fontSize: 16,
		color: "#333",
	},
	locationContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	location: {
		color: "#666",
		fontSize: 13,
		flex: 1,
	},
	detailsContainer: {
		flexDirection: "row",
		gap: 12,
	},
	detailItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	price: {
		color: "#275C9C",
		fontSize: 14,
		fontWeight: "600",
	},
	schedule: {
		color: "#666",
		fontSize: 13,
	},
	availabilityBarContainer: {
		marginTop: 4,
	},
	availabilityBarBackground: {
		height: 6,
		backgroundColor: "#e0e0e0",
		borderRadius: 3,
		overflow: "hidden",
	},
	availabilityBarFill: {
		height: "100%",
		borderRadius: 3,
	},
	availabilityText: {
		marginTop: 4,
		color: "#666",
		fontSize: 11,
	},
	actionButtons: {
		flexDirection: "row",
		marginTop: 16,
		gap: 8,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		gap: 6,
	},
	manageButton: {
		flex: 2,
		backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
	},
	editButton: {
		flex: 1,
		backgroundColor: "#666",
	},
	deleteButton: {
		width: 40,
		backgroundColor: "#F44336",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 13,
	},
});