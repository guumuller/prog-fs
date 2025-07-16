import { ValidationStrategy } from './ValidationStrategy';
import { Usuario } from '../model/Usuario';

export class UsuarioValidationStrategy implements ValidationStrategy {
  validate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.email || data.email.trim() === '') {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Email deve ter formato válido');
    }

    if (!data.senha || data.senha.trim() === '') {
      errors.push('Senha é obrigatória');
    } else if (data.senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 