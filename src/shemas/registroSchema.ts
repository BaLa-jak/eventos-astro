import { z } from "zod";

export const registroSchema = z.object({
  correo: z
    .string({ required_error: "Por favor ingresa tu correo" })
    .min(1, "El correo es obligatorio")
    .email("El correo no es válido")
    .trim(),

  clave: z
    .string({ required_error: "Por favor ingresa tu contraseña" })
    .min(1, "La clave es obligatoria")
    .min(6, "La clave debe tener mas de 6 caracteres")
    .trim(),

});

export type RegistroFormData = z.infer<typeof registroSchema>;