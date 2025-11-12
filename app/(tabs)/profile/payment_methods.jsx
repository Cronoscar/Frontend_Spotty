import { View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, BackHandler, Image } from "react-native";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import PaymentMethodList from "@/components/PaymentMethodList";

const examplePaymentMethods = [
	{
		id: 1,
		title: "Visa ****890",
		expirationDate: "03/2027",
	},
	{
		id: 2,
		title: "Visa ****661",
		expirationDate: "06/2027",
		isDefault: true,
	},
	{
		id: 11,
		title: "Visa ****890",
		expirationDate: "03/2027",
	},
	{
		id: 2321,
		title: "Visa ****661",
		expirationDate: "06/2027",
	},
	{
		id: 1432,
		title: "Visa ****890",
		expirationDate: "03/2027",
	},
	{
		id: 254543,
		title: "Visa ****661",
		expirationDate: "06/2027",
	},
	{
		id: 176576,
		title: "Visa ****890",
		expirationDate: "03/2027",
	},
	{
		id: 34432,
		title: "Visa ****661",
		expirationDate: "06/2027",
	},
	{
		id: 3123121,
		title: "Visa ****890",
		expirationDate: "03/2027",
	},
	{
		id: 111112,
		title: "Visa ****661",
		expirationDate: "06/2027",
	},
];

export default function PaymentMethodsScreen() {
	const [loading, setLoading] = useState(true);
	const [paymentMethods, setPaymentMethods] = useState([]);

	useEffect(function() {
		setTimeout(function() {
			setPaymentMethods(examplePaymentMethods);
			setLoading(false);
		}, 1000);
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<Header title="Métodos de Pago" />
			{
				loading
					? (
						<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
							<ActivityIndicator size="large" color="#275C9C" />
						</View>
					) : (
							<View style={ styles.container }>
								<PaymentMethodList paymentMethods={ paymentMethods } />
								<TouchableOpacity
									style={ styles.button }
									onPress={ () => {} }
								>
									<View style={ styles.buttonText }>
										<Text style={{ color: "#275C9C", fontWeight: "bold", fontSize: 20, marginRight: 10, }}>+</Text>
										<Text style={{ color: "#275C9C", fontSize: 15, }}>Agregar método de pago</Text>
									</View>
								</TouchableOpacity>
							</View>
						)
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingBottom: 20,
		paddingHorizontal: 20,
	},
	button: {
		marginTop: 10,
		borderWidth: 1,
		borderColor: "#275C9C",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
	},
	buttonText: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
});
