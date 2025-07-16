import { ValidationStrategy } from './ValidationStrategy';
import { Produto } from '../model/Produto';

export class ProdutoValidationStrategy implements ValidationStrategy {
  validate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.nome || data.nome.trim() === '') {
      errors.push('Nome do produto é obrigatório');
    }

    if (!data.preco || data.preco <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (!data.categoria || !data.categoria.id) {
      errors.push('Categoria é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 