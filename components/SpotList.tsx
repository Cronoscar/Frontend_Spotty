import { View, FlatList, StyleSheet } from "react-native";
import SpotItem from "./SpotItem";

import { SpotListProps } from "@/types/component";

const SpotList = ({ spots }: SpotListProps) => {
	return (
		<View style={{ flex: 1, width: "95%", alignItems: "center" }}>
			<FlatList
				contentContainerStyle={ styles.content }
				data={ spots }
				keyExtractor={ ( spot ) => spot.ID_Sucursal }
				renderItem={({ item }) => (
					<SpotItem
						id={ item.ID_Sucursal }
						title={ item.Nombre }
						location={ item.Ubicacion }
						freeSpots={ item.Espacios_Disponibles }
						distance={ null }
						stars={ 5 }
						price={ item.Precio_parqueo }
						image={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgVu2z-1Ryx8vhwB99z6MuM6YMA5463fe-sQ&s" }}

					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	content: {
		padding: 10,
	}
});

export default SpotList;
