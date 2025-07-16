import React, { useEffect, useState } from "react";
import { productService } from "../../services/product.service";

type Produto = {
  id: number;
  nome: string;
  categoria: { id: number; nome: string };
  preco: number;
};

export function ProductList() {
  const [products, setProducts] = useState<Produto[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      const { listProducts } = productService();
      try {
        const response = await listProducts(token);
        setProducts(response);
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 w-full">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">{product.nome}</h2>
          <p className="text-gray-600">Categoria: {product.categoria?.nome}</p>
          <p className="text-gray-900 font-bold mt-2">
            R$ {product.preco} 
          </p>
        </div>
      ))}
    </div>
  );
}
