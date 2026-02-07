import { ZodError } from 'zod';
import { ValidatedInputSchema } from '../data/types.js';
import type { ValidatedInput } from '../data/types.js';

export function validateInput(raw: unknown): ValidatedInput {
  return ValidatedInputSchema.parse(raw);
}

export function formatValidationErrors(error: ZodError): string[] {
  return error.errors.map((e) => {
    const path = e.path.join('.');
    return `${path}: ${e.message}`;
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
