import { View, FlatList, StyleSheet } from "react-native";
import PaymentMethod from "./PaymentMethod";

import { PaymentMethod as PaymentMethodProps } from "@/types/payment_method";
import { PaymentMethodListProps } from "@/types/component";

const PaymentMethodList = ({ paymentMethods }: PaymentMethodListProps) => (
	<View style={{ flex: 1, }}>
		<FlatList
			contentContainerStyle={ styles.content }
			data={ paymentMethods }
			keyExtractor={ ( paymentMethod: PaymentMethodProps ) => paymentMethod.id.toString() }
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
