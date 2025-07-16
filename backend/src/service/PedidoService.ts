import { Repository } from "typeorm";
import { Pedido } from "../model/Pedido";
import { Produto } from "../model/Produto";
import { Usuario } from "../model/Usuario";

export class PedidoService {
    private repository: Repository<Pedido>;
    private produtoRepository: Repository<Produto>;
    private usuarioRepository: Repository<Usuario>;

    constructor(
        repository: Repository<Pedido>,
        produtoRepository: Repository<Produto>,
        usuarioRepository: Repository<Usuario>
    ) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async criarPedido(usuarioId: number, produtoIds: number[], observacoes?: string): Promise<Pedido> {
        // Buscar usuário
        const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
        if (!usuario) {
            throw { id: 404, msg: "Usuário não encontrado" };
        }

        // Buscar produtos
        const produtos = await this.produtoRepository.findByIds(produtoIds);
        if (produtos.length !== produtoIds.length) {
            throw { id: 400, msg: "Alguns produtos não foram encontrados" };
        }

        // Calcular valor total
        const valorTotal = produtos.reduce((total, produto) => total + (produto.preco || 0), 0);

        // Criar pedido
        const pedido = new Pedido();
        pedido.usuario = usuario;
        pedido.produtos = produtos;
        pedido.valorTotal = valorTotal;
        pedido.status = 'pendente';
        pedido.observacoes = observacoes;

        return await this.repository.save(pedido);
    }

    async listarPedidos(): Promise<Pedido[]> {
        return await this.repository.find({
            relations: ['usuario', 'produtos']
        });
    }

    async buscarPedidoPorId(id: number): Promise<Pedido> {
        const pedido = await this.repository.findOne({
            where: { id },
            relations: ['usuario', 'produtos']
        });

        if (!pedido) {
            throw { id: 404, msg: "Pedido não encontrado" };
        }

        return pedido;
    }

    async buscarPedidosPorUsuario(usuarioId: number): Promise<Pedido[]> {
        return await this.repository.find({
            where: { usuario: { id: usuarioId } },
            relations: ['usuario', 'produtos']
        });
    }

    async atualizarStatusPedido(id: number, novoStatus: string): Promise<Pedido> {
        const pedido = await this.repository.findOneBy({ id });
        if (!pedido) {
            throw { id: 404, msg: "Pedido não encontrado" };
        }

        const statusValidos = ['pendente', 'aprovado', 'cancelado', 'entregue'];
        if (!statusValidos.includes(novoStatus)) {
            throw { id: 400, msg: "Status inválido" };
        }

        pedido.status = novoStatus;
        return await this.repository.save(pedido);
    }

    async cancelarPedido(id: number): Promise<Pedido> {
        const pedido = await this.repository.findOneBy({ id });
        if (!pedido) {
            throw { id: 404, msg: "Pedido não encontrado" };
        }

        if (pedido.status === 'entregue') {
            throw { id: 400, msg: "Não é possível cancelar um pedido já entregue" };
        }

        pedido.status = 'cancelado';
        return await this.repository.save(pedido);
    }
} 