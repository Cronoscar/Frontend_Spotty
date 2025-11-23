import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, Modal, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { SelectProps } from "@/types/component";

import Configuration from "@/config/constants";

export default function Select({
	selectId,
	name,
	options,
	filters,
	setFilters
}: SelectProps) {
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [current, setCurrent] = useState<number | null>(null);
	const [selected, setSelected] = useState<boolean>(false);

	useEffect(function() {
		setSelected(current != null);
	}, [current]);

	useEffect(function() {
		if (!selected) {
			const { [selectId]: _, ...newFilters } = filters;
			setFilters(newFilters);
			return;
		}

		setFilters({ [selectId]: options[current!], ...filters });
	}, [selected]);

	return (
		<View
			key={ `${selectId}` }
			style={ styles.container }
		>
			<Pressable
				onPress={ function() { setShowOptions(true) } }
				style={
					selected
						? { ...styles.button, backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR }
						: styles.button
				}
			>
				<Pressable
					onPress={ function() { selected ? setCurrent(null) : setShowOptions(true) } }
				>
					<Ionicons color={ selected ? "#fff" : "#000" } size={ 20 } name={ selected ? "close-outline" : "add-outline" } />
				</Pressable>
				<Text
					style={
						selected
							? { ...styles.buttonText, fontWeight: "bold", color: "#fff" }
							: styles.buttonText
					}
				>
					{ name }
					{ selected && <>: { options[current!] }</> }
				</Text>
			</Pressable>

    	<Modal
    	  visible={ showOptions }
    	  animationType="slide"
    	  transparent
    	  onRequestClose={ function() { setShowOptions(false) } }
    	>
    	  <Pressable
					onPress={ function() { setShowOptions(false) } }
					style={ styles.modalOverlay }
			>
					<View style={ styles.modalPanel }>
						<ScrollView contentContainerStyle={ styles.options }>
							{
								options.map((opt: string, idx: number) => (
									<Pressable
										key={ idx }
										onPress={function() {
											setCurrent(idx);
											setShowOptions(false);
										}}
										style={
											current === idx
												? { ...styles.option, backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR }
												: styles.option
											}
									>
										<Text
											style={
												current === idx
													? { ...styles.optionText, color: "#fff" }
													: styles.optionText
											}
										>{ opt }</Text>
									</Pressable>
								))
							}
						</ScrollView>
					</View>
    	  </Pressable>
    	</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: "flex-start",
		borderRadius: 20,
		borderColor: "gray",
		backgroundColor: "lightgray",
	},
	button: {
		borderRadius: 20,
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		paddingVertical: 5,
		paddingHorizontal: 15,
	},
	buttonText: {
		fontSize: 15,
	},
	modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
	},
	modalPanel: {
		borderRadius: 10,
		backgroundColor: "#fff",
		width: "70%",
		maxHeight: "70%",
		marginHorizontal: "auto",
	},
	options: {
		width: "100%",
		padding: 20,
		gap: 10,
	},
	option: {
		borderRadius: 10,
		borderColor: "lightgray",
		borderWidth: 1,
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	optionText: {
		fontSize: 17,
	}
});