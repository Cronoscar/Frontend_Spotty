import { View, FlatList, StyleSheet } from "react-native";
import BookingItem from "./BookingItem";

import { Booking } from "@/types/booking";
import { BookingListProps } from "@/types/component";

const BookingList = ({ bookings }: BookingListProps) => {
	return (
		<View style={{ flex: 1, width: "90%", justifyContent: "center" }}>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ bookings }
				keyExtractor={ ( booking: Booking ) => booking.id.toString() }
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
