import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import { Filter } from "@/types/filter";
import { SearchFiltersProps } from "@/types/component";

import Select from "./Select";

const exampleFilters: Filter[] = [
	{
		id: 1,
		label: "Precio",
		options: ["Bajo", "Medio", "Alto"],
	},
	{
		id: 2,
		label: "Tipo de lugar",
		options: ["Centro Comercial", "Aeropuerto", "Universidad", "Restaurante", "Hospital"]
	},
	{
		id: 3,
		label: "Calificación",
		options: ["1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas", "1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas", "1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas", "1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas"],
	},
	{
		id: 4,
		label: "Disponibilidad",
		options: ["Hoy", "Esta semana", "Este mes"],
	}
];

export default function SearchFilters({
	filters,
	setFilters
}: SearchFiltersProps) {
	const [filtersList, setFiltersList] = useState<Filter[]>([]);

	useEffect(function() {
		setFiltersList(exampleFilters);
	}, []);

	return (
		<ScrollView horizontal contentContainerStyle={ styles.filters } style={{ flexGrow: 0, flexShrink: 1 }} >
			{
				filtersList.map(function(filter: Filter, id: number) {
					return (
						<Select
							key={ `${id}` }
							selectId={ id }
							name={ filter.label }
							options={ filter.options }
							filters={ filters }
							setFilters={ setFilters }
						/>
					);
				}) 
			}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	filters: {
		gap: 10,
		flexDirection: "row",
		paddingHorizontal: 10,
	},
});