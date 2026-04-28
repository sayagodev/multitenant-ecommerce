import z from "zod"

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(25, { message: "Password cannot exceed 20 characters" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Password must contain at least one number",
  })
  .refine((val) => /[!@#$%^*]/.test(val), {
    message: "Password must contain at least one special character (!@#$%^*)",
  })

export const registerSchema = z.object({
  email: z.email(),
  password: passwordSchema,
  confirmPassword: z.string(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(63, "Username must be less than 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number"
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive hyphens"
    )
    .transform((val) => val.toLowerCase()),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
