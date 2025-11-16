import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from "rn-placeholder";
import { useRouter } from "expo-router";
import { useAuth } from '@/contexts/AuthContext';
import UserOptions from "@/components/UserOptions";
import { useAuthStatus } from "@/hooks/useAuthStatus";

import UserService from "@/services/UserService";

import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

import ProfilePicture from "@/assets/images/333.jpg";

export default function() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();
	const { session, loadingSession } = useAuth();

	useAuthStatus(async function() {
		const response: ApiResponse<User> = await UserService.getUser( session!.id );

		if (response?.error) {
			router.replace("/auth");
			return;
		}

		if (response.data) setUser(response?.data);
		setLoading(false);
	});

	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			{/* Header */}
			<View style={ styles.header } >
				<Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>Perfil</Text>
				<View style={ styles.userInfo }>
					{
						!loading
							? (
								<>
									<Image source={ ProfilePicture } style={ styles.userImage } />
									<View style={{ flex: 1, justifyContent: "center", }}>
										<Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>{ user?.fullName }</Text>
										<Text style={{ color: "#fff", fontSize: 15, fontWeight: "300" }}>{ user?.email }</Text>
									</View>
								</>
							)
							: (
								<Placeholder Animation={Fade}>
									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<PlaceholderMedia style={ styles.userImage } />
										<View style={{ flex: 1, }}>
											<PlaceholderLine width={50} />
											<PlaceholderLine width={40} />
										</View>
									</View>
								</Placeholder>
							)
					}
				</View>
			</View>
			{/* */}
			<View style={{ alignItems: "center" }}>
				<View style={ styles.userItems }>
					{
						!loading
							? (
								<>
									<TouchableOpacity
											style={ styles.userItem }
											onPress={ () => {} }
										>
											<Text style={ styles.userItemText }>{ user?.bookings }</Text>
											<Text style={{ fontSize: 12, }}>Reservas</Text>
									</TouchableOpacity>
									<TouchableOpacity
											style={ styles.userItem }
											onPress={ () => {} }
										>
											<Text style={ styles.userItemText }>L.{ user?.expenses }</Text>
											<Text style={{ fontSize: 12, }}>Gastos</Text>
									</TouchableOpacity>
									<TouchableOpacity
											style={ styles.userItem }
											onPress={ () => {} }
										>
											<Text style={ styles.userItemText }>{ user?.favorites }</Text>
											<Text style={{ fontSize: 12, }}>Favoritos</Text>
									</TouchableOpacity>
								</>
							) : (
								<View
									style={{
										flex: 1,
										justifyContent: "center",
										alignItems: "center",
										marginVertical: 15,
									}}
								>
									<ActivityIndicator size="large" color="#275C9C" />
								</View>
							)
					}
				</View>
			</View>
			<UserOptions />
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
		marginRight: 20,
		height: 100,
		width: 100,
	},
	userItems: {
		width: "90%",
		marginVertical: 25,
		flexDirection: "row",
	},
	userItem: {
		flex: 1,
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 15,
		marginHorizontal: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
		alignItems: "center",
	},
	userItemText: {
		color: "#275C9C",
		fontSize: 20,
		fontWeight: "bold",
	},
});
