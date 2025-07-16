import { ProdutoService } from '../src/service/ProdutoService';
import { UsuarioService } from '../src/service/UsuarioService';
import { ProdutoValidationStrategy } from '../src/strategy/ProdutoValidationStrategy';
import { UsuarioValidationStrategy } from '../src/strategy/UsuarioValidationStrategy';
import { LoggingObserver } from '../src/observer/LoggingObserver';
import { NotificationObserver } from '../src/observer/NotificationObserver';

// Mock do DataSourceSingleton
jest.mock('../src/database', () => ({
  DataSourceSingleton: {
    getInstance: jest.fn(() => ({
      getRepository: jest.fn(() => ({
        findOneBy: jest.fn().mockResolvedValue({ id: 1, nome: 'Categoria Teste' })
      }))
    }))
  }
}));

// Mock do repositório para testes
const mockRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  remove: jest.fn()
};

describe('Integration Tests - Padrões Comportamentais', () => {
  let produtoService: ProdutoService;
  let usuarioService: UsuarioService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    produtoService = new ProdutoService(mockRepository as any);
    usuarioService = new UsuarioService(mockRepository as any);
    consoleSpy = jest.spyOn(console, 'log');
    
    // Limpar mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Strategy Pattern Integration', () => {
    test('deve usar estratégia de validação personalizada', async () => {
      const customStrategy = {
        validate: jest.fn().mockReturnValue({ isValid: false, errors: ['Erro customizado'] })
      };

      produtoService.setValidationStrategy(customStrategy as any);
      
      await expect(produtoService.inserir({} as any)).rejects.toEqual(
        expect.objectContaining({
          id: 400,
          msg: 'Dados inválidos: Erro customizado'
        })
      );
    });

    test('deve validar usuário com estratégia padrão', async () => {
      const usuarioInvalido = {
        email: 'email-invalido',
        senha: '123'
      };

      await expect(usuarioService.inserir(usuarioInvalido as any)).rejects.toEqual(
        expect.objectContaining({
          id: 400,
          msg: 'Dados inválidos: Email deve ter formato válido, Senha deve ter pelo menos 6 caracteres'
        })
      );
    });

    test('deve aceitar usuário válido', async () => {
      const usuarioValido = {
        email: 'teste@exemplo.com',
        senha: 'senha123'
      };

      mockRepository.save.mockResolvedValue(usuarioValido);

      const result = await usuarioService.inserir(usuarioValido as any);
      expect(result).toEqual(usuarioValido);
    });
  });

  describe('Observer Pattern Integration', () => {
    test('deve notificar observers quando produto é criado', async () => {
      const produto = {
        id: 1,
        nome: 'Produto Teste',
        preco: 100.50,
        categoria: { id: 1 }
      };

      mockRepository.save.mockResolvedValue(produto);

      // Anexar observers
      produtoService.attachObserver(new LoggingObserver());
      produtoService.attachObserver(new NotificationObserver());

      await produtoService.inserir(produto as any);

      // Verificar se os observers foram notificados
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Notificando observers sobre produto created')
      );
    });

    test('deve notificar observers quando produto é atualizado', async () => {
      const produto = {
        id: 1,
        nome: 'Produto Atualizado',
        preco: 150.00,
        categoria: { id: 1 }
      };

      mockRepository.save.mockResolvedValue(produto);
      mockRepository.findOneBy.mockResolvedValue(produto);

      produtoService.attachObserver(new LoggingObserver());
      produtoService.attachObserver(new NotificationObserver());

      await produtoService.atualizar(1, produto as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Notificando observers sobre produto updated')
      );
    });
  });

  describe('Strategy + Observer Integration', () => {
    test('deve validar e notificar em sequência', async () => {
      const produto = {
        id: 1,
        nome: 'Produto Teste',
        preco: 100.50,
        categoria: { id: 1 }
      };

      mockRepository.save.mockResolvedValue(produto);

      // Configurar observers
      produtoService.attachObserver(new LoggingObserver());
      produtoService.attachObserver(new NotificationObserver());

      const result = await produtoService.inserir(produto as any);

      // Verificar se a validação passou (Strategy)
      expect(result).toEqual(produto);

      // Verificar se os observers foram notificados (Observer)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Notificando observers sobre produto created')
      );
    });

    test('deve rejeitar produto inválido e não notificar observers', async () => {
      const produtoInvalido = {
        nome: '',
        preco: -10,
        categoria: null
      };

      produtoService.attachObserver(new LoggingObserver());
      produtoService.attachObserver(new NotificationObserver());

      await expect(produtoService.inserir(produtoInvalido as any)).rejects.toEqual(
        expect.objectContaining({
          id: 400,
          msg: expect.stringContaining('Dados inválidos')
        })
      );

      // Verificar que os observers não foram notificados (produto não foi salvo)
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Notificando observers sobre produto created')
      );
    });
  });
}); 