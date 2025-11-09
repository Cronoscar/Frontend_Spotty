import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = () => {
	const [input, setInput] = useState("");
	return (
		<SafeAreaView style={ styles.safeArea }>
			<View style={ styles.container }>
				<TextInput
					style={styles.input}
					placeholder="Buscar establecimiento"
					placeholderTextColor="gray"
					value={input}
					onChangeText={setInput}
				/>
				<Ionicons name="search" size={20} color="#999" />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		alignItems: "center",
	},
	container: {
		width: "85%",
		flexDirection: "row",
		// justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		backgroundColor: "lightgray",
		borderRadius: 20,
		paddingHorizontal: 15,
	},
	input: {
		width: "90%",
		paddingVertical: 10,
	}
});

export default SearchScreen;
