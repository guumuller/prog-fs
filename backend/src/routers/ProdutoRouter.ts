import { Router } from 'express';
import { ProdutoController } from '../controller/ProdutoController';

export const produtoRotas = (controller: ProdutoController): Router => {
  const router = Router();

  router.post('/', controller.inserir);
  router.get('/', controller.listar);
  router.get('/meus-produtos', controller.listarPorUsuario);
  router.get('/:id', controller.buscarPorId);
  router.put('/:id', controller.atualizar);
  router.delete('/:id', controller.deletar);

  return router;
};