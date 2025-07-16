import { ProductSubject } from '../src/observer/ProductSubject';
import { LoggingObserver } from '../src/observer/LoggingObserver';
import { NotificationObserver } from '../src/observer/NotificationObserver';
import { Produto } from '../src/model/Produto';

describe('Observer Pattern Tests', () => {
  let subject: ProductSubject;
  let loggingObserver: LoggingObserver;
  let notificationObserver: NotificationObserver;

  beforeEach(() => {
    subject = new ProductSubject();
    loggingObserver = new LoggingObserver();
    notificationObserver = new NotificationObserver();
  });

  test('deve anexar observer corretamente', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    subject.attach(loggingObserver);
    
    expect(consoleSpy).toHaveBeenCalledWith('Observer anexado.');
  });

  test('deve remover observer corretamente', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    subject.attach(loggingObserver);
    subject.detach(loggingObserver);
    
    expect(consoleSpy).toHaveBeenCalledWith('Observer removido.');
  });

  test('deve notificar todos os observers', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const produto: Produto = {
      id: 1,
      nome: 'Produto Teste',
      preco: 100.50
    };

    subject.attach(loggingObserver);
    subject.attach(notificationObserver);
    subject.notify(produto, 'created');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Notificando observers sobre produto created')
    );
  });

  test('deve evitar anexar mesmo observer duas vezes', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    subject.attach(loggingObserver);
    subject.attach(loggingObserver);
    
    expect(consoleSpy).toHaveBeenCalledWith('Observer já está anexado.');
  });
}); 