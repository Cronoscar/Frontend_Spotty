// components/PlaceItem.tsx
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Configuration from "@/config/constants";
import { PlaceItemProps } from "@/types/component";

const PlaceItem = ({ 
    id, 
    title, 
    location, 
    price, 
    availableSpots, 
    totalSpots, 
    schedule,
    img  // Agrega esta propiedad
}: PlaceItemProps & { img?: string }) => {
    const router = useRouter();

    // Calcular el porcentaje de ocupación
    const occupancyRate = totalSpots > 0 
        ? Math.round(((totalSpots - availableSpots) / totalSpots) * 100) 
        : 0;

    // Generar una URL de placeholder basada en el título
    const placeholderUrl = `https://via.placeholder.com/150/cccccc/969696?text=${encodeURIComponent(title.substring(0, 10))}`;

    return (
        <TouchableOpacity
            style={styles.container}
            
        >
            {/* Imagen del lugar - usa la imagen de la API o placeholder */}
            <Image 
                source={{ 
                    uri: img 
                }} 
                style={styles.image}
                onError={(e) => {
                    // Si falla la carga, podemos registrar el error
                    console.log("Error cargando imagen para:", title, "URL:", img);
                }}
            />
            
            <View style={styles.info}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.price}>{price}</Text>
                </View>
                
                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.location} numberOfLines={2}>{location}</Text>
                </View>
                
                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <Ionicons name="car-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>
                            {availableSpots} / {totalSpots} disponibles
                        </Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>{schedule}</Text>
                    </View>
                </View>
                
                {/* Barra de ocupación */}
                <View style={styles.occupancyContainer}>
                    <View style={styles.occupancyBar}>
                        <View 
                            style={[
                                styles.occupancyFill, 
                                { 
                                    width: `${occupancyRate}%`,
                                    backgroundColor: occupancyRate >= 80 ? '#e74c3c' : 
                                                     occupancyRate >= 60 ? '#f39c12' : 
                                                     Configuration.SPOTTY_PRIMARY_COLOR
                                }
                            ]} 
                        />
                    </View>
                    <Text style={styles.occupancyText}>{occupancyRate}% ocupado</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 120,
        height: 140,
        resizeMode: 'cover',
        backgroundColor: '#f0f0f0', // Color de fondo mientras carga
    },
    info: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Configuration.SPOTTY_PRIMARY_COLOR,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
        flex: 1,
    },
    details: {
        marginBottom: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    occupancyContainer: {
        marginTop: 5,
    },
    occupancyBar: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 5,
    },
    occupancyFill: {
        height: '100%',
        borderRadius: 3,
    },
    occupancyText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});

export default PlaceItem;