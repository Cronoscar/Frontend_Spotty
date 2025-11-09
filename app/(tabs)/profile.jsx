import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import ProfilePicture from "@/assets/images/333.jpg";

const exampleUser = {
	fullName: "Jose Bautista",
	email: "correo@gmail.com",
	bookings: 12,
	expenses: 250,
	favorites: 3,
};

const ProfileScreen = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { width, height } = useWindowDimensions();

	useEffect(() => {
		setUser(exampleUser);
		setLoading(false);
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			{
				loading
					? <Text>Loading...</Text>
					: (
						<>
							{/* Header */}
							<View style={ styles.header } >
								<Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>Perfil</Text>
								<View style={ styles.userInfo }>
									<Image source={ ProfilePicture } style={ styles.userImage } />
									<View style={{ flex: 1, justifyContent: "center", marginLeft: 20 }}>
										<Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>{ user.fullName }</Text>
										<Text style={{ color: "#fff", fontSize: 15, fontWeight: "300" }}>{ user.email }</Text>
									</View>
								</View>
							</View>
							{/* */}
							<View style={ styles.userItems }>
								<TouchableOpacity
										style={ styles.userItem }
										onPress={ () => {} }
									>
										<Text style={{ color: "#275C9C", fontSize: 15, fontWeight: "bold" }}>{ user.bookings }</Text>
										<Text>Reservas</Text>
								</TouchableOpacity>
								<TouchableOpacity
										style={ styles.userItem }
										onPress={ () => {} }
									>
										<Text style={{ color: "#275C9C", fontSize: 15, fontWeight: "bold" }}>{ user.expenses }</Text>
										<Text>Gastos</Text>
								</TouchableOpacity>
								<TouchableOpacity
										style={ styles.userItem }
										onPress={ () => {} }
									>
										<Text style={{ color: "#275C9C", fontSize: 15, fontWeight: "bold" }}>{ user.favorites }</Text>
										<Text>Favoritos</Text>
								</TouchableOpacity>
							</View>
							{/* Opciones */}
							<ScrollView
								contentContainerStyle={ styles.userOptions }
							>
								<TouchableOpacity
										style={ styles.userOption }
										onPress={ () => {} }
									>
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<Ionicons name="person-outline" color="#275C9C" size={ 20 } />
											<Text style={ styles.userOptionText }>Editar perfil</Text>
										</View>
										<Ionicons style={{ selfJustify: "end" }} name="chevron-forward-outline" color="gray" size={ 25 }/>
								</TouchableOpacity>


								<TouchableOpacity
										style={ styles.userOption }
										onPress={ () => {} }
									>
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<Ionicons name="card-outline" color="#275C9C" size={ 20 } />
											<Text style={ styles.userOptionText }>Métodos de pago</Text>
										</View>
										<Ionicons style={{ selfJustify: "end" }} name="chevron-forward-outline" color="gray" size={ 25 }/>
								</TouchableOpacity>


								<TouchableOpacity
										style={ styles.userOption }
										onPress={ () => {} }
									>
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<Ionicons name="help-circle-outline" color="#275C9C" size={ 20 } />
											<Text style={ styles.userOptionText }>Ayuda y soporte</Text>
										</View>
										<Ionicons style={{ selfJustify: "end" }} name="chevron-forward-outline" color="gray" size={ 25 }/>
								</TouchableOpacity>


								<TouchableOpacity
										style={ styles.userOption }
										onPress={ () => {} }
									>
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<Ionicons name="settings-outline" color="#275C9C" size={ 20 } />
											<Text style={ styles.userOptionText }>Configuración</Text>
										</View>
										<Ionicons style={{ selfJustify: "end" }} name="chevron-forward-outline" color="gray" size={ 25 }/>
								</TouchableOpacity>


								<TouchableOpacity
										style={{ ...styles.userOption, borderColor: "red" }}
										onPress={ () => {} }
									>
										<View style={{ flexDirection: "row", alignItems: "center" }}>
											<Ionicons name="log-out-outline" color="red" size={ 20 } />
											<Text style={{ ...styles.userOptionText, color: "red" }}>Cerrar sesión</Text>
										</View>
								</TouchableOpacity>
							</ScrollView>
						</>
					)
			}
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#275C9C",
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		paddingTop: 50,
		paddingBottom: 25,
		paddingHorizontal: 30,
		// alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		gap: 10,
	},
	userInfo: {
		flexDirection: "row",
	},
	userImage: {
		borderRadius: 100,
		maxWidth: 100,
		maxHeight: 100,
	},
	userItems: {
		marginVertical: 25,
		flexDirection: "row",
		justifyContent: "center",
	},
	userItem: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 15,
		marginHorizontal: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
		alignItems: "center",
	},
	userOptions: {
		alignItems: "center",
	},
	userOption: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "85%",
		paddingVertical: 20,
		paddingHorizontal: 15,
		marginBottom: 15,
	},
	userOptionText: {
		marginLeft: 10,
		fontSize: 15,
	}
});

export default ProfileScreen;
