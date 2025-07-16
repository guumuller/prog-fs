import { ProdutoValidationStrategy } from '../src/strategy/ProdutoValidationStrategy';
import { UsuarioValidationStrategy } from '../src/strategy/UsuarioValidationStrategy';

describe('Strategy Pattern Tests', () => {
    describe('ProdutoValidationStrategy', () => {
        let strategy: ProdutoValidationStrategy;

        beforeEach(() => {
            strategy = new ProdutoValidationStrategy();
        });

        test('deve validar produto com dados corretos', () => {
            const produto = {
                nome: 'Produto Teste',
                preco: 100.50,
                categoria: { id: 1 }
            };

            const result = strategy.validate(produto);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('deve rejeitar produto sem nome', () => {
            const produto = {
                nome: '',
                preco: 100.50,
                categoria: { id: 1 }
            };

            const result = strategy.validate(produto);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Nome do produto é obrigatório');
        });

        test('deve rejeitar produto com preço inválido', () => {
            const produto = {
                nome: 'Produto Teste',
                preco: 0,
                categoria: { id: 1 }
            };

            const result = strategy.validate(produto);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Preço deve ser maior que zero');
        });

        test('deve rejeitar produto sem categoria', () => {
            const produto = {
                nome: 'Produto Teste',
                preco: 100.50,
                categoria: null
            };

            const result = strategy.validate(produto);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Categoria é obrigatória');
        });
    });

    describe('UsuarioValidationStrategy', () => {
        let strategy: UsuarioValidationStrategy;

        beforeEach(() => {
            strategy = new UsuarioValidationStrategy();
        });

        test('deve validar usuário com dados corretos', () => {
            const usuario = {
                email: 'teste@exemplo.com',
                senha: 'senha123'
            };

            const result = strategy.validate(usuario);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('deve rejeitar usuário com email inválido', () => {
            const usuario = {
                email: 'email-invalido',
                senha: 'senha123'
            };

            const result = strategy.validate(usuario);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Email deve ter formato válido');
        });

        test('deve rejeitar usuário com senha muito curta', () => {
            const usuario = {
                email: 'teste@exemplo.com',
                senha: '123'
            };

            const result = strategy.validate(usuario);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Senha deve ter pelo menos 6 caracteres');
        });

        test('deve rejeitar usuário sem email', () => {
            const usuario = {
                email: '',
                senha: 'senha123'
            };

            const result = strategy.validate(usuario);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Email é obrigatório');
        });
    });
}); 