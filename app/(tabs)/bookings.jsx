import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { BookingFilter } from "@/config.js";
import BookingList from "@/components/BookingList";

const examplePastBookings = [
	{
    id: 1,
    title: "Reserva pasada 1",
    state: "Confirmado",
    location: "Av. Los Próceres #45, Tegucigalpa",
    date: "2025-11-09",
    time: "07:30 AM - 10:30 AM",
    price: 50,
	},
	{
    id: 2,
    title: "Reserva pasada 2",
    state: "Confirmado",
    location: "Av. Los Próceres #45, Tegucigalpa",
    date: "2025-11-09",
    time: "07:30 AM - 10:30 AM",
    price: 50,
	}
]

const exampleBookings = [
  {
    id: 1,
    title: "Parqueo Central",
    state: "Confirmado",
    location: "Av. Los Próceres #45, Tegucigalpa",
    date: "2025-11-09",
    time: "07:30 AM - 10:30 AM",
    price: 50,
  },
  {
    id: 2,
    title: "Parking Mall Multiplaza",
    state: "Confirmado",
    location: "Boulevard Suyapa, Tegucigalpa",
    date: "2025-11-10",
    time: "09:00 AM - 09:00 AM",
    price: 80,
  },
  {
    id: 3,
    title: "Parqueo Zona Viva",
    state: "Confirmado",
    location: "Col. Palmira, Calle 8",
    date: "2025-11-05",
    time: "06:15 PM - 09:00 AM",
    price: 60,
  },
  {
    id: 4,
    title: "Parking Aeropuerto Toncontín",
    state: "Confirmado",
    location: "Carretera al Sur",
    date: "2025-11-01",
    time: "11:45 AM - 09:00 AM",
    price: 100,
  },
  {
    id: 5,
    title: "Parqueo Estadio Nacional",
    state: "Confirmado",
    location: "Boulevard Morazán",
    date: "2025-11-12",
    time: "04:00 PM - 09:00 AM",
    price: 75,
  },
];


const ToggleFilter = ({ selected, setSelected }) => {
	return (
		<View
			style={ styles.filter }
		>
			<TouchableOpacity
				accessibilityRole="radio"
				accessibilityState={{ selected: selected === BookingFilter.ON_GOING }}
				onPress={() => setSelected(BookingFilter.ON_GOING)}
				style={{
					...styles.filterOption,
					backgroundColor: selected === BookingFilter.ON_GOING ? "#fff" : "lightgray",
				}}
			>
				<Text>En curso</Text>
			</TouchableOpacity>

			<TouchableOpacity
				accessibilityRole="radio"
				accessibilityState={{ selected: selected === BookingFilter.PAST }}
				onPress={() => setSelected(BookingFilter.PAST)}
				style={{
					...styles.filterOption,
					backgroundColor: selected === BookingFilter.PAST ? "#fff" : "lightgray",
				}}
			>
				<Text>Pasados</Text>
			</TouchableOpacity>
		</View>
	);
}

const BookingsScreen = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState(BookingFilter.ON_GOING);

	useEffect(() => {
		setBookings(selected === BookingFilter.ON_GOING ? exampleBookings : examplePastBookings);
		setLoading(false);
	}, [selected]);

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<View style={ styles.header } >
				<Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
					Mis Reservaciones
				</Text>
			</View>
			<ToggleFilter selected={ selected } setSelected={ setSelected }/>
			<View style={ styles.container } >
				{
					loading
						? <Text>Loading...</Text>
						: <BookingList bookings={ bookings }/>
				}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#275C9C",
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		paddingTop: 70,
		paddingBottom: 16,
		alignItems: "center",
		justifyContent: "center",
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
