import { ProductObserver } from './ProductObserver';
import { Produto } from '../model/Produto';

export class LoggingObserver implements ProductObserver {
  update(produto: Produto, action: 'created' | 'updated' | 'deleted'): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Produto ${action}: ID=${produto.id}, Nome="${produto.nome}", Preço=${produto.preco}`);
  }
} 