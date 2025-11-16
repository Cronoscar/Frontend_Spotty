import { ScrollView, TouchableOpacity, StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PaymentMethodOptionType } from "@/types/paymentMethod";

export default function PaymentMethodOption({ type, label, icon, selectedType, setType }: PaymentMethodOptionType) {
	const backgroundColor = selectedType === type ? "#275C9C" : "#FFFFFF";
	const textColor = selectedType === type ? "#FFFFFF" : "#000000";

	return (
		<Pressable
			onPress={ () => setType!(type) }
			style={{ ...styles.container, backgroundColor: backgroundColor, }}
		>
			<Ionicons
				style={{ color: textColor }}
				name={ icon as any }
				size={ 30 }
			/>
			<Text style={{ color: textColor }}>{ label }</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15,
		borderWidth: 1,
		borderColor: "lightgray",
		borderRadius: 10,
		marginVertical: 10,
		gap: 10,
	},
});