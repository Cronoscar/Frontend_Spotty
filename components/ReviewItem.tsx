import { Pressable, View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Alert } from "react-native";

import { ReviewItemProps } from "@/types/component";

export default function ReviewItem({ id, userName, title, content, image }: ReviewItemProps) {
	return (
		<View style={ styles.container }>
			<View style={ styles.header }>
				<Image style={ styles.image } source={ image } />
				<Text style={{ fontWeight: "bold", color: "gray", }}>{ userName }</Text>
			</View>
			<Text style={ styles.title }>{ title }</Text>
			<Text style={ styles.content }>{ content }</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		borderRadius: 5,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		padding: 20,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	image: {
		width: 30,
		height: 30,
		maxWidth: 30,
		maxHeight: 30,
		borderRadius: 100,
		marginRight: 10,
	},
	title: {
		fontWeight: "bold",
		marginBottom: 10,
	},
	content: {
		fontSize: 12,
		color: "gray",
	}
});
