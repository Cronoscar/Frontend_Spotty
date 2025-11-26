import { Text, View, StyleSheet } from "react-native";

import Header from "@/components/Header";
import FAQList from "@/components/FAQList";

import Configuration from "@/config/constants";

import faqs from "@/data/faqs";

export default function() {
	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<Header title="Ayuda y Soporte" />
			<View style={ styles.container }>
				<Text style={{ fontWeight: "bold", color: "gray", fontSize: 15, }}>Preguntas Frecuentes</Text>
				<View style={{ borderBottomColor: "lightgray", borderBottomWidth: 1, marginVertical: 10 }}></View>
				<FAQList faqs={ faqs } />
				<Text style={{ fontWeight: "bold", color: "gray", fontSize: 15, marginTop: 10, }}>Contáctanos</Text>
				<View style={{ borderBottomColor: "lightgray", borderBottomWidth: 1, marginVertical: 10 }}></View>
				<Text style={{ fontWeight: "bold" }}>
					Teléfono: <Text style={{ color: Configuration.SPOTTY_PRIMARY_COLOR, fontWeight: "normal" }}>2238-9768</Text>
				</Text>
				<Text style={{ fontWeight: "bold" }}>
					email: <Text style={{ color: Configuration.SPOTTY_PRIMARY_COLOR, fontWeight: "normal" }}>spotty@gmail.com</Text>
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 30,
		paddingVertical: 20,
	},
});