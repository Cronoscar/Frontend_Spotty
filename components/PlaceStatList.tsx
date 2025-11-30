import { View, FlatList, StyleSheet } from "react-native";
import PlaceStatItem from "./PlaceStatItem";

import { PlaceStatListProps } from "@/types/component";

const PlaceStatList = ({ places }: PlaceStatListProps) => {
	return (
		<View style={{ flex: 1, }}>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ places }
				keyExtractor={ ( spot ) => spot.id.toString() }
				renderItem={({ item }) => (
					<PlaceStatItem
						id={ item.id }
						title={ item.title }
						location={ item.location }
						price={ item.price }
						availableSpots={ item.availableSpots }
						totalSpots={ item.totalSpots }
						schedule={ item.schedule }
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	content: {
		padding: 10,
	}
});

export default PlaceStatList;