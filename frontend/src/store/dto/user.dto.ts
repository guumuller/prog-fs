import {  TUserData } from "../types/TUserData";

export type TUserDto = {
	user: TUserData | null;
	setUser: (userData: TUserData | null) => void;
};