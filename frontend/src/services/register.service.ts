import { TUserData } from "../store/types/TUserData";
import { api } from "./api.service";

export function registerService() {
    async function register(
        data: TUserData,
    ) {
        try {
            const response = await api.post(
                '/api/usuarios',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response;
        } catch {
            console.log("Erro ao registrar")
        }
    }

    return{
        register
    }
}