import { View, FlatList, StyleSheet } from "react-native";
import SpotItem from "./SpotItem";

const SpotList = ({ spots }) => {
	return (
		<View style={{ flex: 1, width: "95%", alignItems: "center" }}>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ spots }
				keyStractor={ ( spot ) => spot.id }
				renderItem={({ item }) => (
					<SpotItem
						id={ item.id }
						title={ item.title }
						location={ item.location }
						freeSpots={ item.freeSpots }
						distance={ item.distance }
						stars={ item.stars }
						price={ item.price }
						image={ item.image }
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

export default SpotList;
