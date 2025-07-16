import { Router } from 'express';
import { PedidoController } from '../controller/PedidoController';

export const pedidoRotas = (controller: PedidoController): Router => {
  const router = Router();

  router.post('/', controller.criarPedido);
  router.get('/', controller.listarPedidos);
  router.get('/:id', controller.buscarPedidoPorId);
  router.get('/usuario/:usuarioId', controller.buscarPedidosPorUsuario);
  router.put('/:id/status', controller.atualizarStatusPedido);
  router.delete('/:id', controller.cancelarPedido);

  return router;
}; 