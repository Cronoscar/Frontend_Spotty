import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { BookingFilter } from "@/config/enums.js";
import BookingList from "@/components/BookingList";
import { useAuth } from '@/contexts/AuthContext';
import { useAuthStatus } from "@/hooks/useAuthStatus";

import BookingService from "@/services/BookingService";

const BookingsScreen = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState(BookingFilter.ON_GOING);
	const { session } = useAuth();

	useAuthStatus();

	useEffect(function() {
		async function getBookings() {
			const response = await BookingService.getUserBookings( session?.id, filter );

			setLoading(false);

			if (response?.error) {
				Alert.alert("Error obteniendo reservaciones", "Por favor, inténtelo más tarde");
				return;
			}

			setBookings(response.data);
		};

		setLoading(true);
		getBookings();
	}, [filter]);

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<View style={ styles.header } >
				<Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
					Mis Reservaciones
				</Text>
			</View>
			<ToggleFilter filter={ filter } setFilter={ setFilter } isLoading={ loading }/>
			<View style={ styles.container } >
				{
					loading
						? <ActivityIndicator size='large' color='#275C9C' />
						: <BookingList bookings={ bookings }/>
				}
			</View>
		</View>
	);
};

function ToggleFilter({ filter, setFilter, isLoading }) {
	return (
		<View
			style={ styles.filter }
		>
			<TouchableOpacity
				accessibilityRole="radio"
				accessibilityState={{ filter: filter === BookingFilter.ON_GOING }}
				onPress={() => !isLoading && setFilter(BookingFilter.ON_GOING)}
				style={{
					...styles.filterOption,
					backgroundColor: filter === BookingFilter.ON_GOING ? "#fff" : "lightgray",
				}}
			>
				<Text>En curso</Text>
			</TouchableOpacity>

			<TouchableOpacity
				accessibilityRole="radio"
				accessibilityState={{ filter: filter === BookingFilter.PAST }}
				onPress={() => !isLoading && setFilter(BookingFilter.PAST)}
				style={{
					...styles.filterOption,
					backgroundColor: filter === BookingFilter.PAST ? "#fff" : "lightgray",
				}}
			>
				<Text>Pasados</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#275C9C",
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		paddingTop: 70,
		paddingBottom: 16,
		paddingHorizontal: 25,
		alignItems: "center",
		// justifyContent: "center",
		flexDirection: "row",
		gap: 10,
	},
	filter: {
		flexDirection: "row",
		alignSelf: "center",
		backgroundColor: "lightgray",
		borderRadius: 10,
		padding: 2,
		width: "85%",
		justifyContent: "center",
		marginTop: 10,
	},
	filterOption: {
		paddingVertical: 10,
		paddingHorizontal: 18,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
	},
});

export default BookingsScreen;
