import { View, FlatList, StyleSheet } from "react-native";
import BookingCommerceItem from "./BookingCommerceItem";

import { BookingCommerce } from "@/types/booking";
import { BookingCommerceListProps } from "@/types/component";

const BookingCommerceList = ({ bookings }: BookingCommerceListProps) => {
	return (
		<View style={{ flex: 1 }}>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ bookings }
				keyExtractor={ ( booking: BookingCommerce ) => booking.id.toString() }
				renderItem={({ item }) => (
					<BookingCommerceItem
						id={ item.id }
						title={ item.title }
						location={ item.location }
						nBookings={ item.nBookings }
						totalSpots={ item.totalSpots }
						availableSpots={ item.availableSpots }
						bookings={ [] }
						img={ item.img }
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	content: {
		padding: 5,
	}
});

export default BookingCommerceList;
