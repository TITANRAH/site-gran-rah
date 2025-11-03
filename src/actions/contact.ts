import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const contact = {
  sendEmail: defineAction({
    accept: "form",
    input: z.object({
      name: z
        .string()
        .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
      phone: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 10, {
          message: "El teléfono debe tener al menos 10 dígitos"
        }),
      email: z
        .string()
        .email({ message: "El correo electrónico no es válido" }),
      subject: z
        .string()
        .min(5, { message: "El asunto debe tener al menos 5 caracteres" }),
      message: z
        .string()
        .min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
    }),
    handler: async (input) => {
      const url = `${
        import.meta.env.HOME_URL
      }/wp-json/contact-form-7/v1/contact-forms/198/feedback`;

      const formData = new FormData();
      formData.append("your-name", input.name);
      formData.append("your-email", input.email);
      formData.append("your-phone", input.phone || "");
      formData.append("your-subject", input.subject);
      formData.append("your-message", input.message);
      formData.append("_wpcf7_unit_tag", "wpcf7-123");

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      console.log("data ->", data);

      return data;
    },
  }),
};
