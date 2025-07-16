import { ProductObserver } from './ProductObserver';
import { Produto } from '../model/Produto';

export class NotificationObserver implements ProductObserver {
  update(produto: Produto, action: 'created' | 'updated' | 'deleted'): void {
    const message = this.createMessage(produto, action);
    this.sendNotification(message);
  }

  private createMessage(produto: Produto, action: 'created' | 'updated' | 'deleted'): string {
    const actions = {
      created: 'criado',
      updated: 'atualizado',
      deleted: 'removido'
    };

    return `Produto "${produto.nome}" foi ${actions[action]} no sistema. Preço: R$ ${produto.preco}`;
  }

  private sendNotification(message: string): void {
    // Simulação de envio de notificação
    console.log(`📧 NOTIFICAÇÃO: ${message}`);
    // Em um cenário real, aqui seria enviado email, SMS, push notification, etc.
  }
} 