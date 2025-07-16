import { Router } from 'express';
import { UsuarioController } from '../controller/UsuarioController';

export const usuarioRotas = (controller: UsuarioController): Router => {
  const router = Router();

  router.post('/', controller.inserir);
  router.get('/', controller.listar);
  router.get('/:id', controller.buscarPorId);
  router.put('/:id', controller.atualizar);
  router.delete('/:id', controller.deletar);

  return router;
};