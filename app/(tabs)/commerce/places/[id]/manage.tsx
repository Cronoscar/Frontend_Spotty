import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ManageSpacesScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [rows, setRows] = useState([
        { label: "A", spaces: 10 },
        { label: "B", spaces: 9 },
    ]);

    const addRow = () => {
        const nextLetter = String.fromCharCode(65 + rows.length);
        setRows([...rows, { label: nextLetter, spaces: 1 }]);
    };

    const updateSpaces = (index: number, delta: number) => {
        setRows(rows.map((row, i) => 
            i === index
                ? { ...row, spaces: Math.max(1, row.spaces + delta) }
                : row
        ));
    };

    const totalSpaces = rows.reduce((acc, row) => acc + row.spaces, 0);

    const saveChanges = () => {
        // Aquí llamas tu API para actualizar los espacios
        console.log("Guardando cambios...", rows);

        router.back();
    };

    return (
        <View style={styles.container}>
            
            {/* BOTÓN VOLVER */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#333" />
                <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Gestionar Espacios</Text>

            {/* LISTA DE FILAS */}
            <FlatList
                data={rows}
                keyExtractor={(item) => item.label}
                renderItem={({ item, index }) => (
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>{item.label}</Text>

                        <View style={styles.counter}>
                            <TouchableOpacity 
                                onPress={() => updateSpaces(index, -1)} 
                                style={styles.counterBtn}
                            >
                                <Ionicons name="remove" size={18} color="#333" />
                            </TouchableOpacity>

                            <Text style={styles.counterText}>{item.spaces}</Text>

                            <TouchableOpacity 
                                onPress={() => updateSpaces(index, 1)} 
                                style={styles.counterBtn}
                            >
                                <Ionicons name="add" size={18} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Agregar fila */}
            <TouchableOpacity style={styles.addRowBtn} onPress={addRow}>
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text style={styles.addRowText}>Agregar Fila</Text>
            </TouchableOpacity>

            {/* Total */}
            <Text style={styles.totalText}>Total: {totalSpaces} espacios</Text>

            {/* Guardar */}
            <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
                <Text style={styles.saveBtnText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    backText: {
        fontSize: 16,
        color: "#333",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    rowLabel: {
        fontSize: 18,
        fontWeight: "600",
    },
    counter: {
        flexDirection: "row",
        alignItems: "center",
    },
    counterBtn: {
        backgroundColor: "#eee",
        padding: 10,
        borderRadius: 6,
    },
    counterText: {
        fontSize: 18,
        marginHorizontal: 15,
    },
    addRowBtn: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    addRowText: {
        color: "#007AFF",
        marginLeft: 6,
        fontSize: 16,
    },
    totalText: {
        marginTop: 25,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    saveBtn: {
        backgroundColor: "#275C9C",
        padding: 14,
        borderRadius: 10,
        marginTop: 25,
    },
    saveBtnText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
});
