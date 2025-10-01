import z from "zod";

export const createBlogZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be string" })
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(200, { message: "Title cannot exceed 200 characters." }),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(300, "Excerpt must be less than 300 characters"),
  tags: z.array(z.string()).optional(),
  isFeatured: z
    .boolean({ invalid_type_error: "isFeatured must be true or false" })
    .optional(),
  isPublished: z
    .boolean({ invalid_type_error: "isPublished must be true or false" })
    .optional(),
  content: z
    .string({ invalid_type_error: "Content must be string" })
    .min(10, { message: "Content must be at least 10 characters long." })
    .max(50000, { message: "Content cannot exceed 50000 characters." }),
});

export const updateBlogZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be string" })
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(200, { message: "Title cannot exceed 200 characters." })
    .optional(),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(300, "Excerpt must be less than 300 characters")
    .optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z
    .boolean({ invalid_type_error: "isFeatured must be true or false" })
    .optional(),
  isPublished: z
    .boolean({ invalid_type_error: "isPublished must be true or false" })
    .optional(),
  content: z
    .string({ invalid_type_error: "Content must be string" })
    .min(10, { message: "Content must be at least 10 characters long." })
    .max(50000, { message: "Content cannot exceed 50000 characters." })
    .optional(),
});
