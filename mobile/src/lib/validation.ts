import { z } from 'zod';

/**
 * Shared field schemas + form schemas for the auth flow. Validating on the
 * client is a UX courtesy, not a security boundary — the API must re-
 * validate everything it receives regardless of what this layer allows
 * through.
 */

export const emailSchema = z.email('Informe um e-mail válido.').max(254);

export const passwordSchema = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres.')
  .max(128)
  .regex(/[A-Za-z]/, 'A senha precisa ter pelo menos uma letra.')
  .regex(/[0-9]/, 'A senha precisa ter pelo menos um número.');

export const nameSchema = z.string().trim().min(2, 'Informe o nome completo.').max(120);

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Informe um telefone válido, com DDD.');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe sua senha.'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptedTerms: z.literal(true, { error: 'Você precisa aceitar os termos para continuar.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

/**
 * Runs a zod schema and reshapes issues into a flat `{ field: message }` map
 * — convenient for driving each Input's `hint`/`status` props without every
 * screen re-implementing the same zod-error-to-form-state plumbing.
 */
export function getFieldErrors<T extends z.ZodType>(schema: T, values: unknown): Partial<Record<string, string>> {
  const result = schema.safeParse(values);
  if (result.success) return {};

  const errors: Partial<Record<string, string>> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? '_form');
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
