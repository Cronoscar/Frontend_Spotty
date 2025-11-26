import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Configuration from "@/config/constants";

type HeaderProps = {
	title: string;
	backAction?: () => void;
};

export default function Header({ title, backAction }: HeaderProps) {
	const router = useRouter();
	const action = backAction ? backAction : () => router.back();

	return (
		<View style={ styles.header }>
			<TouchableOpacity
				onPress={ action }
			>
				<Ionicons name="arrow-back-circle-outline" color="#fff" size={ 30 } />
			</TouchableOpacity>
			<Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
				{ title }
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		paddingTop: 70,
		paddingBottom: 16,
		paddingHorizontal: 25,
		alignItems: "center",
		flexDirection: "row",
		gap: 10,
	},
});
