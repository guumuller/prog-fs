import { ProductObserver } from './ProductObserver';
import { Produto } from '../model/Produto';

export class ProductSubject {
  private observers: ProductObserver[] = [];

  attach(observer: ProductObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Observer já está anexado.');
    }

    console.log('Observer anexado.');
    this.observers.push(observer);
  }

  detach(observer: ProductObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Observer não encontrado.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Observer removido.');
  }

  notify(produto: Produto, action: 'created' | 'updated' | 'deleted'): void {
    console.log(`Notificando observers sobre produto ${action}: ${produto.nome}`);
    for (const observer of this.observers) {
      observer.update(produto, action);
    }
  }
} 