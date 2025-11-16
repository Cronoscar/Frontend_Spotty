import { ScrollView, TouchableOpacity, StyleSheet, View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Configuration from "@/config/constants";
import { PaymentMethod } from "@/config/enums";

import PaymentMethodOption from "@/components/PaymentMethodOption";

import { useSpotBooking } from "@/contexts/SpotBookingContext";

export default function() {
	const { data, setData } = useSpotBooking();

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(data?.paymentMethod || null);

	const router = useRouter();

	useEffect(function() {
		setData({
			...data,
			paymentMethod: paymentMethod ?? undefined,
		});
	}, [paymentMethod]);

	return (
		<SafeAreaView style={ styles.safeArea }>
			<TouchableOpacity
				style={{ alignSelf: "flex-start", paddingBottom: 10, }}
				onPress={ () => router.back() }
			>
				<Ionicons
					style={ styles.backButton }
					name="arrow-back-outline"
					size={ 20 }
				/>
			</TouchableOpacity>
			<ScrollView
				contentContainerStyle={{ padding: 15 }}
			>
				<View style={ styles.container }>
					<Text style={ styles.title }>Método de Pago</Text>
					<Text style={ styles.subtitle }>Elige cómo quieres pagar</Text>
				</View>
				<View style={ styles.paymentMethodsContainer }>
					<Text>Tipo de pago</Text>
					{
						Configuration.paymentMethods.map((method) => (
							<PaymentMethodOption
								key={ method.type }
								type={ method.type }
								label={ method.label }
								icon={ method.icon }
								selectedType={ paymentMethod }
								setType={ setPaymentMethod }
							/>
						))
					}
				</View>
				<View style={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 10, padding: 15, }}>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
						<Text>Subtotal (2 horas)</Text>
						<Text>${ data?.subtotal ?? 0 }</Text>
					</View>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
						<Text>ISV</Text>
						<Text>${ data?.isv ?? 0 }</Text>
					</View>
					<View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
						<Text>Total</Text>
						<Text>${ data?.total ?? 0 }</Text>
					</View>
				</View>
				{
					paymentMethod && (
						<TouchableOpacity
							onPress={ () => router.push("/spotBooking/paymentDetails") }
							style={ styles.button }
						>
							<Text style={ styles.buttonText }>Continuar</Text>
						</TouchableOpacity>
					)
				}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#fff",
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	container: {
	},
	backButton: {
		backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
		color: Configuration.SPOTTY_PRIMARY_COLOR,
		borderRadius: 100,
		padding: 10,
	},
	title: {
		fontWeight: "bold",
		fontSize: 20,
	},
	subtitle: {
		fontSize: 15,
		color: "gray",
		marginVertical: 10,
		marginHorizontal: 15,
	},
	paymentMethodsContainer: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 10,
		marginVertical: 25,
		paddingBottom: 35,
	},
	button: {
		alignSelf: "center",
		backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
		paddingVertical: 10,
		paddingHorizontal: 25,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		marginTop: 20,
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
	}
});