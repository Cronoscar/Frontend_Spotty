import { View, FlatList, StyleSheet } from "react-native";
import PlaceItem from "./PlaceItem";

import { PlaceListProps } from "@/types/component";

const PlaceList = ({ places }: PlaceListProps) => {
	return (
		<View style={{ flex: 1, }}>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ places }
				keyExtractor={ ( spot ) => spot.id.toString() }
				renderItem={({ item }) => (
					<PlaceItem
						id={ item.id }
						title={ item.title }
						location={ item.location }
						price={ item.price }
						availableSpots={ item.availableSpots }
						totalSpots={ item.totalSpots }
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

export default PlaceList;