import { text } from "framer-motion/client";
import { api } from "./api.service";

export function productService() {
  async function listProducts(token: string) {
    try {
      const response = await api.get('/api/produtos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
      throw error;
    }
  }

  async function deleteProduct(id: number, token: string) {
    try {
      const response = await api.delete(`/api/produtos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Erro ao deletar produto", error);
      throw error;
    }
  }

  async function createProduct(
    nome: string,
    preco: number,
    categoriaId: number,
    descricao: string,
    imagemUrl: string,
    token: string
  ) {
    try {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        throw new Error("ID do usuário não encontrado no localStorage");
      }
      
      const response = await api.post('/api/produtos', {
        nome,
        preco,
        categoria: { id: categoriaId },
        descricao,
        imagemUrl,
        usuario: { id: Number(userId) }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar produto", error);
      throw error;
    }
  }

  async function updateProduct(
    id: number,
    nome: string,
    preco: number,
    categoriaId: number,
    descricao: string,
    imagemUrl: string,
    token: string
  ) {
    try {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        throw new Error("ID do usuário não encontrado no localStorage");
      }
      
      const response = await api.put(`/api/produtos/${id}`, {
        nome,
        preco,
        categoria: { id: categoriaId },
        descricao,
        imagemUrl,
        usuario: { id: Number(userId) }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar produto", error);
      throw error;
    }
  }

  async function uploadImage(file: File, token: string) {
    const formData = new FormData();
    formData.append('imagem', file);
    try {
      const response = await api.post('/api/upload-imagem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem', error);
      throw error;
    }
  }

  async function listCategories(token: string) {
    const response = await api.get('/api/categorias', {
      headers: { Authorization: `Bearer ${token}` }
    });
    try {
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias', error);
      throw error;
    }
  }

  return {
    listProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    uploadImage,
    listCategories
  };

}
