import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, { message: 'validation.nameRequired' }).trim(),
  email: z
    .string()
    .min(1, { message: 'validation.emailRequired' })
    .email({ message: 'validation.emailInvalid' })
    .trim(),
  message: z
    .string()
    .min(1, { message: 'validation.messageRequired' })
    .min(10, { message: 'validation.messageTooShort' })
    .trim(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
