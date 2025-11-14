import { View, FlatList, StyleSheet } from "react-native";
import ReviewItem from "./ReviewItem";

import UserImage from "@/assets/images/333.jpg";

export default function ReviewList({ reviews }) {
	return (
		<View style={{ flex: 1, }}>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ reviews }
				keyStractor={ ( review ) => review.id }
				renderItem={({ item }) => (
					<ReviewItem
						id={ item.id }
						userName={ item.userName }
						title={ item.title }
						content={ item.content }
						image={ item.image || UserImage }
					/>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		padding: 10,
	}
});
