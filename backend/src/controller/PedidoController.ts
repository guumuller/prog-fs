import { Request, Response } from 'express';
import { PedidoService } from '../service/PedidoService';

export class PedidoController {
    private service: PedidoService;

    constructor(service: PedidoService) {
        this.service = service;
    }

    criarPedido = async (req: Request, res: Response): Promise<void> => {
        try {
            const { usuarioId, produtoIds, observacoes } = req.body;
            
            if (!usuarioId || !produtoIds || !Array.isArray(produtoIds)) {
                res.status(400).json({ 
                    error: "Dados inválidos. usuarioId e produtoIds (array) são obrigatórios" 
                });
                return;
            }

            const pedido = await this.service.criarPedido(usuarioId, produtoIds, observacoes);
            res.status(201).json(pedido);
        } catch (err: any) {
            res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
        }
    };

    listarPedidos = async (_req: Request, res: Response): Promise<void> => {
        try {
            const pedidos = await this.service.listarPedidos();
            res.status(200).json(pedidos);
        } catch (err: any) {
            res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
        }
    };

    buscarPedidoPorId = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const pedido = await this.service.buscarPedidoPorId(id);
            res.status(200).json(pedido);
        } catch (err: any) {
            res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
        }
    };

    buscarPedidosPorUsuario = async (req: Request, res: Response): Promise<void> => {
        try {
            const usuarioId = parseInt(req.params.usuarioId);
            const pedidos = await this.service.buscarPedidosPorUsuario(usuarioId);
            res.status(200).json(pedidos);
        } catch (err: any) {
            res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
        }
    };

    atualizarStatusPedido = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;

            if (!status) {
                res.status(400).json({ error: "Status é obrigatório" });
                return;
            }

            const pedido = await this.service.atualizarStatusPedido(id, status);
            res.status(200).json(pedido);
        } catch (err: any) {
            res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
        }
    };

    cancelarPedido = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const pedido = await this.service.cancelarPedido(id);
            res.status(200).json(pedido);
        } catch (err: any) {
            res.status(err.id || 500).json({ error: err.msg || "Erro interno do servidor" });
        }
    };
} 