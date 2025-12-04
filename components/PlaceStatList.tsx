// components/PlaceStatList.tsx
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import PlaceStatItem from "./PlaceStatItem";
import { PlaceListProps } from "@/types/component";
import { useState } from "react";

const PlaceStatList = ({ places, onRefresh }: PlaceListProps) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (onRefresh) {
            setRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setRefreshing(false);
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                contentContainerStyle={styles.content}
                data={places}
                keyExtractor={(spot) => spot.id.toString()}
                renderItem={({ item }) => {
                    // TypeScript no reconoce estas propiedades en Place, así que usamos 'any'
                    const placeWithStats = item as any;
                    
                    return (
                        <PlaceStatItem
                            id={placeWithStats.id}
                            title={placeWithStats.title}
                            location={placeWithStats.location}
                            price={placeWithStats.price}
                            availableSpots={placeWithStats.availableSpots}
                            totalSpots={placeWithStats.totalSpots}
                            schedule={placeWithStats.schedule || ""}
                            img={placeWithStats.img}
                            occupancyRate={placeWithStats.occupancyRate}
                            totalReservations={placeWithStats.totalReservations || 0}
                            totalRevenue={placeWithStats.totalRevenue || 0}
                            activeReservations={placeWithStats.activeReservations || 0}
                            completedReservations={placeWithStats.completedReservations || 0}
                            upcomingReservations={placeWithStats.upcomingReservations || 0}
                        />
                    );
                }}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={["#275C9C"]}
                            tintColor="#275C9C"
                        />
                    ) : undefined
                }
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 10,
        paddingBottom: 20,
    }
});

export default PlaceStatList;