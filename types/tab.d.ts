import { UserRole } from "@/config/enums";

export type Tab = {
	name: string;
	title: string;
	icon: any;
	roles: UserRole[];
	show: boolean;
};