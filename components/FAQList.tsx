import { FlatList, View, StyleSheet } from "react-native";

import FAQItem from "./FAQItem";
import { FAQListProps } from "@/types/component";
import { FAQ } from "@/types/faq";

const FAQList = ({ faqs }: FAQListProps) => (
	<View style={{ flex: 1, }}>
		<FlatList
			contentContainerStyle={ styles.content }
			data={ faqs }
			keyExtractor={ ( faq: FAQ ) => faq.id.toString() }
			renderItem={({ item }) => (
				<FAQItem
					title={ item.title }
					answer={ item.answer }
				/>
			)}
		/>
	</View>
);

const styles = StyleSheet.create({
	content: {
		padding: 0,
	}
});

export default FAQList;