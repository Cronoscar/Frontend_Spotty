// components/PlaceList.tsx
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import PlaceItem from "./PlaceItem";
import { PlaceListProps } from "@/types/component";
import { useState } from "react";

const PlaceList = ({ places, onRefresh }: PlaceListProps) => {
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
                renderItem={({ item }) => (
                    <PlaceItem
                        id={item.id}
                        title={item.title}
                        location={item.location}
                        price={item.price}
                        availableSpots={item.availableSpots}
                        totalSpots={item.totalSpots}
                        schedule={item.schedule || ""}
                        // Pasar la imagen
                        img={item.img}
                    />
                )}
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

export default PlaceList;