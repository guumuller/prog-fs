import { api } from "./api.service";

export function userService() {
    async function listUsers(token: string) {
        try {
        const response = await api.get('/api/usuarios', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
        } catch (error) {
        console.error("Erro ao buscar usuários", error);
        throw error;
        }
    }

    async function deleteUser(id: number, token: string) {
        try {
        const response = await api.delete(`/api/usuarios/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
        } catch (error) {
        console.log("Erro ao deletar usuário", error);
        throw error;
        }
    }

    return {
        listUsers,
        deleteUser
    };
} 