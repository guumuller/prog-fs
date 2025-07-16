import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components/sideBar/SideBar";
import { productService } from "../../services/product.service";

type Produto = {
  id: number;
  nome: string;
  categoria: { id: number; nome: string };
  preco: number;
  descricao: string;
  imagemUrl: string;
};

type Categoria = {
  id: number;
  nome: string;
};

export function DashboardPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [descricao, setDescricao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { listProducts, deleteProduct, uploadImage, createProduct, listCategories } = productService();

  useEffect(() => {
    if (userId) {
      setUsuarioId(Number(userId));
    }

    const fetchProdutos = async () => {
      if (token) {
        try {
          const data = await listProducts(token);
          setProdutos(data);
        } catch (error) {
          console.error("Erro ao carregar produtos", error);
        }
      }
    };

    const fetchCategorias = async () => {
      if (token) {
        try {
          const data = await listCategories(token);
          setCategorias(data);
        } catch (error) {
          console.error("Erro ao carregar categorias", error);
        }
      }
    };

    fetchProdutos();
    fetchCategorias();
  }, []);

  const deleteProductById = async (id: number) => {
    if (!token) return;

    try {
      await deleteProduct(id, token);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setErrorMsg("");
    e.preventDefault();

    if (!token || !usuarioId || !file) {
      setErrorMsg("Preencha todos os campos obrigatórios e selecione uma imagem.");
      return;
    }

    if (preco === "" || isNaN(Number(preco)) || Number(preco) <= 0) {
      setErrorMsg("O preço deve ser maior que zero.");
      return;
    }

    try {
      const uploadResult = await uploadImage(file, token);
      const imageUrl = uploadResult.imageUrl;

      const novoProduto = await createProduct(
        nome,
        Number(preco),
        Number(categoriaId),
        descricao,
        imageUrl,
        token
      );

      setProdutos((prev) => [...prev, novoProduto]);
      setFile(null);
      setNome("");
      setPreco("");
      setDescricao("");
      setErrorMsg("");
      setCategoriaId("");
      
      // Limpar o input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error: any) {
      setErrorMsg(error?.response?.data?.msg || error?.response?.data?.error || "Erro ao adicionar produto");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <form className="mb-6 space-y-4 bg-white p-4 rounded-xl shadow" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">Adicionar Produto</h2>

          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Preço"
            value={preco}
            onChange={e => setPreco(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <select
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
            className="w-full h-11 border rounded"
            required
          >
            <option value="" disabled hidden>Selecione a categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
              required
            />
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Adicionar Produto
          </button>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>
          )}
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-bold">{produto.nome}</h2>
              <p className="text-gray-600">Categoria: {produto.categoria.nome}</p>
              <p className="text-blue-600 font-semibold">R$ {produto.preco}</p>
              <p className="text-gray-600 font-semibold">{produto.descricao}</p>
              <img src={produto.imagemUrl} alt={produto.nome} className="w-full h-40 object-cover rounded-md" />

              <button
                onClick={() => deleteProductById(produto.id)}
                className="top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
