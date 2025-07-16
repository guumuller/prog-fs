import { api } from "./api.service";

interface TUserData {
	email: string;
    senha: string;
}

export function loginService() {
    async function login(
        data: TUserData,
    ) {
        try {
            const response = await api.post(
                '/api/login',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response;
        } catch {
            console.log("Erro ao logar")
        }
    }

    return{
        login
    }
}