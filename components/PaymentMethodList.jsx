import { View, FlatList, StyleSheet } from "react-native";
import PaymentMethod from "./PaymentMethod";

const PaymentMethodList = ({ paymentMethods }) => (
	<View style={{ flex: 1, }}>
		<FlatList
			contentContainerStyle={ styles.content }
			data={ paymentMethods }
			keyStractor={ ( paymentMethod ) => paymentMethod.id }
			renderItem={({ item }) => (
				<PaymentMethod
					title={ item.title }
					expirationDate={ item.expirationDate }
					isDefault={ item.isDefault }
				/>
			)}
		/>
	</View>
);

const styles = StyleSheet.create({
	content: {
		padding: 10,
	}
});

export default PaymentMethodList;
