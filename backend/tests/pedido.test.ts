import { PedidoService } from '../src/service/PedidoService';

// Mock dos repositórios
const mockPedidoRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  remove: jest.fn()
};

const mockProdutoRepository = {
  findByIds: jest.fn(),
  findOneBy: jest.fn()
};

const mockUsuarioRepository = {
  findOneBy: jest.fn()
};

describe('PedidoService', () => {
  let pedidoService: PedidoService;

  beforeEach(() => {
    pedidoService = new PedidoService(
      mockPedidoRepository as any,
      mockProdutoRepository as any,
      mockUsuarioRepository as any
    );
    
    // Limpar mocks
    jest.clearAllMocks();
  });

  describe('criarPedido', () => {
    test('deve criar um pedido com sucesso', async () => {
      const usuario = { id: 1, email: 'teste@exemplo.com' };
      const produtos = [
        { id: 1, nome: 'Produto 1', preco: 100 },
        { id: 2, nome: 'Produto 2', preco: 200 }
      ];
      const pedidoEsperado = {
        id: 1,
        usuario,
        produtos,
        valorTotal: 300,
        status: 'pendente',
        observacoes: 'Teste'
      };

      mockUsuarioRepository.findOneBy.mockResolvedValue(usuario);
      mockProdutoRepository.findByIds.mockResolvedValue(produtos);
      mockPedidoRepository.save.mockResolvedValue(pedidoEsperado);

      const resultado = await pedidoService.criarPedido(1, [1, 2], 'Teste');

      expect(resultado).toEqual(pedidoEsperado);
      expect(mockUsuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockProdutoRepository.findByIds).toHaveBeenCalledWith([1, 2]);
      expect(mockPedidoRepository.save).toHaveBeenCalled();
    });

    test('deve lançar erro quando usuário não for encontrado', async () => {
      mockUsuarioRepository.findOneBy.mockResolvedValue(null);

      await expect(pedidoService.criarPedido(999, [1, 2])).rejects.toEqual({
        id: 404,
        msg: "Usuário não encontrado"
      });
    });

    test('deve lançar erro quando produtos não forem encontrados', async () => {
      const usuario = { id: 1, email: 'teste@exemplo.com' };
      const produtos = [{ id: 1, nome: 'Produto 1', preco: 100 }];

      mockUsuarioRepository.findOneBy.mockResolvedValue(usuario);
      mockProdutoRepository.findByIds.mockResolvedValue(produtos);

      await expect(pedidoService.criarPedido(1, [1, 2])).rejects.toEqual({
        id: 400,
        msg: "Alguns produtos não foram encontrados"
      });
    });
  });

  describe('atualizarStatusPedido', () => {
    test('deve atualizar status do pedido com sucesso', async () => {
      const pedido = { id: 1, status: 'pendente' };
      const pedidoAtualizado = { ...pedido, status: 'aprovado' };

      mockPedidoRepository.findOneBy.mockResolvedValue(pedido);
      mockPedidoRepository.save.mockResolvedValue(pedidoAtualizado);

      const resultado = await pedidoService.atualizarStatusPedido(1, 'aprovado');

      expect(resultado).toEqual(pedidoAtualizado);
      expect(mockPedidoRepository.save).toHaveBeenCalledWith({
        ...pedido,
        status: 'aprovado'
      });
    });

    test('deve lançar erro para status inválido', async () => {
      const pedido = { id: 1, status: 'pendente' };

      mockPedidoRepository.findOneBy.mockResolvedValue(pedido);

      await expect(pedidoService.atualizarStatusPedido(1, 'status_invalido')).rejects.toEqual({
        id: 400,
        msg: "Status inválido"
      });
    });

    test('deve lançar erro quando pedido não for encontrado', async () => {
      mockPedidoRepository.findOneBy.mockResolvedValue(null);

      await expect(pedidoService.atualizarStatusPedido(999, 'aprovado')).rejects.toEqual({
        id: 404,
        msg: "Pedido não encontrado"
      });
    });
  });

  describe('cancelarPedido', () => {
    test('deve cancelar pedido com sucesso', async () => {
      const pedido = { id: 1, status: 'pendente' };
      const pedidoCancelado = { ...pedido, status: 'cancelado' };

      mockPedidoRepository.findOneBy.mockResolvedValue(pedido);
      mockPedidoRepository.save.mockResolvedValue(pedidoCancelado);

      const resultado = await pedidoService.cancelarPedido(1);

      expect(resultado).toEqual(pedidoCancelado);
      expect(mockPedidoRepository.save).toHaveBeenCalledWith({
        ...pedido,
        status: 'cancelado'
      });
    });

    test('deve lançar erro ao tentar cancelar pedido entregue', async () => {
      const pedido = { id: 1, status: 'entregue' };

      mockPedidoRepository.findOneBy.mockResolvedValue(pedido);

      await expect(pedidoService.cancelarPedido(1)).rejects.toEqual({
        id: 400,
        msg: "Não é possível cancelar um pedido já entregue"
      });
    });
  });
}); 