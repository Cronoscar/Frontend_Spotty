import { View, FlatList, StyleSheet } from "react-native";
import SpotItem from "./SpotItem";

const SpotList = ({ spots }) => {
	return (
		<View>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ spots }
				keyStractor={ ( spot ) => spot.id }
				renderItem={({ item }) => (
					<SpotItem
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
