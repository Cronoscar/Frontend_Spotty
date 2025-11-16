import { ScrollView, TouchableOpacity, StyleSheet, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function() {
	const router = useRouter();

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
					<Text style={ styles.title }>Detalles del Pago</Text>
					<Text style={ styles.subtitle }>Ingresa tu información de pago</Text>
				</View>
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
		backgroundColor: "#88CFE7",
		color: "#275C9C",
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
});