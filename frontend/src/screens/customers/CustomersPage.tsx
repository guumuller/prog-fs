import React, { useEffect, useState, useRef } from "react";
import { Sidebar } from "../../components/sideBar/SideBar";
import { userService } from "../../services/user.service";
import { productService } from "../../services/product.service";
import { MoreVertical, Pencil, Trash, Package } from "lucide-react";

type Usuario = {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    tipo: string;
};

export function CustomersPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("todos");
    const token = localStorage.getItem("token");
    const [modalOpenId, setModalOpenId] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [editModalId, setEditModalId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ nome: '', email: '', telefone: '', tipo: '', senha: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [showUserProductsModal, setShowUserProductsModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userProducts, setUserProducts] = useState<any[]>([]);
    const [userProductsLoading, setUserProductsLoading] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedProductName, setSelectedProductName] = useState<string>('');
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [editProductForm, setEditProductForm] = useState({ nome: '', preco: '', categoriaId: '', descricao: '', imagemUrl: '' });
    const [editProductLoading, setEditProductLoading] = useState(false);
    const [editProductError, setEditProductError] = useState('');
    const [categorias, setCategorias] = useState<any[]>([]);
    const currentUserId = localStorage.getItem("userId");

    const { listUsers, deleteUser } = userService();
    const { listProducts, updateProduct, listCategories } = productService();

    useEffect(() => {
        const fetchUsuarios = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const data = await listUsers(token);
                    const sorted = data.slice().sort((a, b) => {
                        if (!a.nome) return 1;
                        if (!b.nome) return -1;
                        return a.nome.localeCompare(b.nome);
                    });
                    setUsuarios(sorted);
                    setErrorMsg("");
                } catch (error) {
                    setErrorMsg("Erro ao carregar lista de usuários");
                } finally {
                    setLoading(false);
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

        fetchUsuarios();
        fetchCategorias();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalOpenId(null);
            }
        }
        if (modalOpenId !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalOpenId]);

    const deleteUserById = async (id: number) => {
        if (!token) return;

        try {
            await deleteUser(id, token);
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            setErrorMsg("Erro ao deletar usuário");
        }
    };

    const openEditModal = (usuario: Usuario) => {
        setEditForm({
            nome: usuario.nome || '',
            email: usuario.email || '',
            telefone: usuario.telefone || '',
            tipo: usuario.tipo || '',
            senha: ''
        });
        setEditModalId(usuario.id);
        setModalOpenId(null);
        setEditError('');
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || editModalId === null) return;
        setEditLoading(true);
        setEditError('');
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${editModalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao atualizar usuário');
            }
            setUsuarios(prev => prev.map(u => u.id === editModalId ? { ...u, ...editForm } : u));
            setEditModalId(null);
        } catch (err: any) {
            setEditError(err.message || 'Erro ao atualizar usuário');
        } finally {
            setEditLoading(false);
        }
    };

    const openUserProductsModal = async (usuario: Usuario) => {
        setSelectedUserId(usuario.id);
        setShowUserProductsModal(true);
        setUserProductsLoading(true);
        setModalOpenId(null);
        
        try {
            if (token) {
                const allProducts = await listProducts(token);
                const produtosDoUsuario = allProducts.filter((produto: any) => 
                    produto.usuario?.id === usuario.id
                );
                setUserProducts(produtosDoUsuario);
            }
        } catch (error) {
            console.error("Erro ao carregar produtos do usuário", error);
        } finally {
            setUserProductsLoading(false);
        }
    };

    const openImageModal = (imageUrl: string, productName: string) => {
        setSelectedImage(imageUrl);
        setSelectedProductName(productName);
        setShowImageModal(true);
    };

    const openEditProductModal = (produto: any) => {
        if (produto.usuario?.id !== Number(currentUserId)) {
            setEditProductError('Você não tem permissão para editar este produto');
            return;
        }
        
        setEditingProduct(produto);
        setEditProductForm({
            nome: produto.nome || '',
            preco: produto.preco?.toString() || '',
            categoriaId: produto.categoria?.id?.toString() || '',
            descricao: produto.descricao || '',
            imagemUrl: produto.imagemUrl || ''
        });
        setShowEditProductModal(true);
        setEditProductError('');
    };

    const handleEditProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !editingProduct) return;
        
        setEditProductLoading(true);
        setEditProductError('');
        
        try {
            const updatedProduct = await updateProduct(
                editingProduct.id,
                editProductForm.nome,
                Number(editProductForm.preco),
                Number(editProductForm.categoriaId),
                editProductForm.descricao,
                editProductForm.imagemUrl,
                token
            );
            
            setUserProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
            setShowEditProductModal(false);
        } catch (err: any) {
            if (err.response?.status === 403) {
                setEditProductError('Você não tem permissão para editar este produto');
            } else {
                setEditProductError(err.response?.data?.error || err.message || 'Erro ao atualizar produto');
            }
        } finally {
            setEditProductLoading(false);
        }
    };

    const usuariosFiltrados = usuarios.filter((usuario) => {
        const matchesSearch = usuario.nome && usuario.nome.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === "todos" || usuario.tipo.toLowerCase() === filterType.toLowerCase();
        return matchesSearch && matchesType;
    });

    return (
        <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Clientes</h1>
                    <p className="text-gray-600">Gerencie todos os usuários do sistema</p>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
            </div>

            {errorMsg && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMsg}
                </div>
            )}

        {loading ? (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Carregando usuários...</div>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow-md">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Nome</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Telefone</th>
                            <th className="px-4 py-2 text-left">
                                <div className="flex items-center gap-2">
                                    <span>Tipo</span>
                                    <div className="relative">
                                        <select
                                            value={filterType}
                                            onChange={e => setFilterType(e.target.value)}
                                            className="appearance-none bg-transparent border-none text-sm focus:outline-none cursor-pointer"
                                        >
                                            <option value="todos">Todos</option>
                                            <option value="admin">Admin</option>
                                            <option value="usuario">Usuário</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th className="px-4 py-2 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((usuario, idx) => (
                            <tr key={usuario.id} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="px-4 py-2 font-semibold text-gray-800">{usuario.nome ? usuario.nome : "?"}</td>
                                <td className="px-4 py-2 text-gray-600">{usuario.email}</td>
                                <td className="px-4 py-2 text-gray-600">{usuario.telefone}</td>
                                <td className="px-4 py-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        usuario.tipo === 'ADMIN' 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {usuario.tipo}
                                    </span>
                                </td>
                                <td className="px-4 py-2 relative">
                                    <button
                                        onClick={() => setModalOpenId(usuario.id)}
                                        className="text-gray-600 hover:text-gray-900 p-2 rounded-full focus:outline-none"
                                        title="Ações do usuário"
                                    >
                                        <MoreVertical size={18} className="text-gray-400" />
                                    </button>
                                    {modalOpenId === usuario.id && (
                                        <div ref={modalRef} className="absolute z-10 right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
                                            
                                            <button
                                                onClick={() => openEditModal(usuario)}
                                                className="w-full text-left px-4 py-2 text-slate-400 hover:text-slate-500 flex items-center gap-2"
                                            >
                                                <Pencil size={16} className="mr-2" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => openUserProductsModal(usuario)}
                                                className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800 rounded-t flex items-center gap-2"
                                            >
                                                <Package size={16} className="mr-2" />
                                                Produtos
                                            </button>
                                            <button
                                                onClick={() => { deleteUserById(usuario.id); setModalOpenId(null); }}
                                                className="w-full text-left px-4 py-2 text-red-600 hover:text-red-800 rounded-b flex items-center gap-2"
                                            >
                                                <Trash size={16} className="mr-2" />
                                                Deletar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {!loading && usuariosFiltrados.length === 0 && (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                <p className="text-gray-500">Não há usuários cadastrados no sistema.</p>
            </div>
        )}
        </div>

        {editModalId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <form onSubmit={handleEditSubmit} className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
                    <h2 className="text-lg font-bold mb-4">Editar Usuário</h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={editForm.nome}
                            onChange={e => setEditForm(f => ({ ...f, nome: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editForm.email}
                            onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Telefone"
                            value={editForm.telefone}
                            onChange={e => setEditForm(f => ({ ...f, telefone: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                        />
                        <select
                            value={editForm.tipo}
                            onChange={e => setEditForm(f => ({ ...f, tipo: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Selecione o tipo</option>
                            <option value="usuario">Usuário</option>
                            <option value="admin">Admin</option>
                        </select>
                        <input
                            type="password"
                            placeholder="Senha (deixe em branco para não alterar)"
                            value={editForm.senha}
                            onChange={e => setEditForm(f => ({ ...f, senha: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    {editError && <div className="text-red-500 text-sm mt-2">{editError}</div>}
                    <div className="mt-6 flex justify-end gap-2">
                        <button type="button" onClick={() => setEditModalId(null)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={editLoading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">{editLoading ? 'Salvando...' : 'Salvar'}</button>
                    </div>
                </form>
            </div>
        )}

        {showUserProductsModal && selectedUserId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 min-w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">
                            Produtos de {usuarios.find(u => u.id === selectedUserId)?.nome}
                        </h2>
                        <button 
                            onClick={() => setShowUserProductsModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {userProductsLoading ? (
                        <div className="text-center py-8">
                            <div className="text-gray-500">Carregando produtos...</div>
                        </div>
                    ) : userProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-4">
                                <Package size={48} className="mx-auto" />
                            </div>
                            <p className="text-gray-500">Este usuário ainda não adicionou produtos.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-xl shadow-md">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">Nome</th>
                                        <th className="px-4 py-2 text-left">Categoria</th>
                                        <th className="px-4 py-2 text-left">Preço</th>
                                        <th className="px-4 py-2 text-left">Descrição</th>
                                        <th className="px-4 py-2 text-left">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userProducts.map((produto, idx) => (
                                        <tr key={produto.id} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                            <td className="px-4 py-2 font-semibold text-gray-800">{produto.nome}</td>
                                            <td className="px-4 py-2 text-gray-600">{produto.categoria?.nome || 'N/A'}</td>
                                            <td className="px-4 py-2 text-blue-600 font-semibold">R$ {produto.preco}</td>
                                            <td className="px-4 py-2 text-gray-600 max-w-xs truncate">{produto.descricao}</td>
                                            <td className="px-4 py-2">
                                                {produto.imagemUrl && (
                                                    <button
                                                        onClick={() => openImageModal(produto.imagemUrl, produto.nome)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm underline mr-2"
                                                    >
                                                        Visualizar Imagem
                                                    </button>
                                                )}
                                                {produto.usuario?.id === Number(currentUserId) ? (
                                                    <button
                                                        onClick={() => openEditProductModal(produto)}
                                                        className="text-green-600 hover:text-green-800 text-sm underline"
                                                    >
                                                        Editar
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Não autorizado</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        )}

        {showImageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Imagem do Produto: {selectedProductName}</h2>
                        <button 
                            onClick={() => setShowImageModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <img 
                            src={selectedImage} 
                            alt={selectedProductName}
                            className="max-w-full max-h-96 object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>
        )}

        {showEditProductModal && editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <form onSubmit={handleEditProductSubmit} className="bg-white rounded-lg shadow-lg p-6 min-w-[400px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Editar Produto</h2>
                        <button 
                            type="button"
                            onClick={() => setShowEditProductModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nome do produto"
                            value={editProductForm.nome}
                            onChange={e => setEditProductForm(f => ({ ...f, nome: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        
                        <input
                            type="number"
                            placeholder="Preço"
                            value={editProductForm.preco}
                            onChange={e => setEditProductForm(f => ({ ...f, preco: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        
                        <select
                            value={editProductForm.categoriaId}
                            onChange={e => setEditProductForm(f => ({ ...f, categoriaId: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Selecione a categoria</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </option>
                            ))}
                        </select>
                        
                        <textarea
                            placeholder="Descrição"
                            value={editProductForm.descricao}
                            onChange={e => setEditProductForm(f => ({ ...f, descricao: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                            rows={3}
                        />
                        
                        <input
                            type="text"
                            placeholder="URL da imagem"
                            value={editProductForm.imagemUrl}
                            onChange={e => setEditProductForm(f => ({ ...f, imagemUrl: e.target.value }))}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    
                    {editProductError && <div className="text-red-500 text-sm mt-2">{editProductError}</div>}
                    
                    <div className="mt-6 flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={() => setShowEditProductModal(false)} 
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={editProductLoading} 
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {editProductLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        )}
    </div>
    );
}
