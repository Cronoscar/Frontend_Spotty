import { Slot } from "expo-router";

export default function() {
	return <Slot />
	// return (
	// 	<Tabs
	// 		screenOptions={{
	// 			tabBarActiveTintColor: "#275C9C",
	// 			tabBarInactiveTintColor: "gray",
	// 			headerShown: false,
	// 		}}>
	// 			{
	// 				tabs.map(function(tab: Tab) {
	// 					return (
	// 						<Tabs.Screen
	// 							name={ tab.name }
	// 							options={{
	// 									title: tab.title,
	// 									tabBarIcon: function({ color, size }) {
	// 										return <Ionicons name={ tab.icon } color={ color } size={ size } />
	// 									},
	// 									...( tab.show ? {} : { href: null } )
	// 							}}
	// 						/>
	// 					);
	// 				})
	// 			}
	// 	</Tabs>
	// );
};