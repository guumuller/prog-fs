export interface ValidationStrategy {
  validate(data: any): { isValid: boolean; errors: string[] };
} 