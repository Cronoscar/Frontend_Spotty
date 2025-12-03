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
    <Text style={{ marginTop: 5, fontSize: 14 }}>{ totalBookings } espacios reservados en total</Text>

    {/* Botones de QR */}
    <View style={styles.scanContainer}>
      <TouchableOpacity style={styles.scanButtonPrimary}>
        <Ionicons name="log-in-outline" size={22} color="#fff" />
        <Text style={styles.scanButtonText}>Registrar Entrada</Text>
        <Text style={styles.scanButtonSubText}>Escanear QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scanButtonSecondary}>
        <Ionicons name="log-out-outline" size={22} color={Configuration.SPOTTY_PRIMARY_COLOR} />
        <Text style={styles.scanButtonTextSecondary}>Registrar Salida</Text>
        <Text style={styles.scanButtonSubTextSecondary}>Escanear QR</Text>
      </TouchableOpacity>
    </View>

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
	},scanContainer: {
  flexDirection: "row",
  marginTop: 20,
  marginBottom: 15,
  gap: 10,
},

scanButtonPrimary: {
  flex: 1,
  backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
  paddingVertical: 18,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
},

scanButtonSecondary: {
  flex: 1,
  backgroundColor: "#e8eef5",
  paddingVertical: 18,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: Configuration.SPOTTY_PRIMARY_COLOR,
},

scanButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  marginTop: 5,
},

scanButtonSubText: {
  color: "#dbe6ff",
  fontSize: 13,
},

scanButtonTextSecondary: {
  color: Configuration.SPOTTY_PRIMARY_COLOR,
  fontSize: 16,
  fontWeight: "bold",
  marginTop: 5,
},

scanButtonSubTextSecondary: {
  color: Configuration.SPOTTY_PRIMARY_COLOR,
  fontSize: 13,
},

});