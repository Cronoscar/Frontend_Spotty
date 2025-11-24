import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/config/enums";

export default function() {
	// const { session } = useAuth();
	// return session.role === UserRole.COMMERCE ? <Slot /> : <Redirect href="/clients" />;
	return <Slot />
};