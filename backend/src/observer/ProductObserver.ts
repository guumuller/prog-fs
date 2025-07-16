import { Produto } from '../model/Produto';

export interface ProductObserver {
  update(produto: Produto, action: 'created' | 'updated' | 'deleted'): void;
} 