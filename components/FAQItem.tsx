import { View, StyleSheet, Text, Pressable } from "react-native";
import { useState } from "react";

import { FAQItemProps } from "@/types/component";
import { Ionicons } from "@expo/vector-icons";

export default function FAQItem({ title, answer }: FAQItemProps) {
	const [expand, setExpand] = useState<boolean>(false);

	return (
		<Pressable
			style={ styles.container }
			onPress={ () => setExpand(expand => !expand) }
		>
			<View style={ styles.header }>
				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
					<View style={{ flex: 2, }}>
						<Text style={ styles.title }>{ title }</Text>
					</View>

					<Ionicons name={ !expand ? "chevron-down-outline" : "chevron-up-outline" } size={ 20 } />
				</View>
			</View>
			{
				expand && (
					<Text style={ styles.answer }>
						{ answer }
					</Text>
				)
			}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		borderColor: "lightgray",
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		paddingVertical: 20,
		paddingHorizontal: 15,
		marginBottom: 10,
	},
	header: {
		flex: 1,
		flexDirection: "row",
	},
	title: {
		fontWeight: "light",
		fontSize: 15,
	},
	answer: {
		padding: 10,
		color: "gray",
		fontSize: 13,
	}
});