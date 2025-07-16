import { create } from "zustand";
import { TUserDto } from "./dto/user.dto";
import { TUserData } from "./types/TUserData";


export const userStore = create<TUserDto>()((set) => ({
	user: null,
	setUser: (userData: TUserData | null) =>
		set((state) => ({ user: (state.user = userData) })),
}));