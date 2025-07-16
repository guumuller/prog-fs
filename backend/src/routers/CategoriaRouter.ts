import { Router } from 'express';
import { CategoriaController } from '../controller/CategoriaController';

export const categoriaRotas = (controller: CategoriaController): Router => {
  const router = Router();

  router.post('/', controller.inserir);
  router.get('/', controller.listar);
  router.get('/:id', controller.buscarPorId);
  router.put('/:id', controller.atualizar);
  router.delete('/:id', controller.deletar);

  return router;
}; 