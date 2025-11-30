import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { BookingCommerce } from "@/types/booking";

import Configuration from "@/config/constants";
import BookingCommerceList from "@/components/BookingCommerceList";

export const mockBookings: BookingCommerce[] = [
  {
    id: 1,
    title: "Parqueo Central",
    location: "Centro Histórico",
    nBookings: 12,
    availableSpots: 8,
    totalSpots: 20,
    img: "https://example.com/parking1.jpg",
  },
  {
    id: 2,
    title: "Mall Premier",
    location: "Boulevard Principal",
    nBookings: 30,
    availableSpots: 5,
    totalSpots: 35,
    img: "https://example.com/parking2.jpg",
  },
  {
    id: 3,
    title: "Edificio Torre Azul",
    location: "Zona Financiera",
    nBookings: 7,
    availableSpots: 13,
    totalSpots: 20,
  },
  {
    id: 4,
    title: "Campus Universitario",
    location: "Sector Norte",
    nBookings: 18,
    availableSpots: 2,
    totalSpots: 20,
    img: "https://example.com/parking4.jpg",
  },
  {
    id: 5,
    title: "Hospital Metropolitano",
    location: "Avenida Las Flores",
    nBookings: 9,
    availableSpots: 11,
    totalSpots: 20,
  },
];


export default function() {
	const [loading, setLoading] = useState<boolean>(true);
	const [totalBookings, setTotalBookings] = useState<number>(0);
	const [bookings, setBookings] = useState<BookingCommerce[]>([]);

	useEffect(function() {
		setBookings(mockBookings);
		setLoading(false);
	}, []);

	useEffect(function() {
		setTotalBookings(bookings.reduce(function(acc: number, curr: BookingCommerce) {
			return acc + curr.nBookings
		}, 0));
	}, [bookings]);

	if (loading || !bookings) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					marginVertical: 15,
				}}
			>
				<ActivityIndicator size="large" color={ Configuration.SPOTTY_PRIMARY_COLOR } />
			</View>
		);
	}
	return(
		<SafeAreaView style={ styles.safeArea }>
			<Text style={{ fontSize: 23, fontWeight: "bold" }}>Reservas activas</Text>
			<Text style={{ marginTop: 5, fontSize: 14, }}>{ totalBookings } espacios reservados en total</Text>
			<View style={ styles.bookings }>
				<BookingCommerceList bookings={ bookings } />
			</View>
		</SafeAreaView>
	);
}


const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#fff",
		paddingVertical: 10,
		paddingHorizontal: 25,
	},
	bookings: {
		flex: 1,
		marginTop: 10,
	},
});