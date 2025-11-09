import { View, FlatList, StyleSheet } from "react-native";
import BookingItem from "./BookingItem";

const BookingList = ({ bookings }) => {
	return (
		<View style={{ flex: 1, width: "90%", justifyContent: "center" }}>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ bookings }
				keyStractor={ ( booking ) => booking.id }
				renderItem={({ item }) => (
					<BookingItem
						title={ item.title }
						state={ item.state }
						location={ item.location }
						date={ item.date }
						time={ item.time }
						price={ item.price }
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

export default BookingList;
