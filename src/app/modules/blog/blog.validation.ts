import z from "zod";

export const createBlogZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be string" })
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(200, { message: "Title cannot exceed 200 characters." }),
  slug: z
    .string({ invalid_type_error: "Slug must be string" })
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(200, { message: "Slug cannot exceed 200 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be lowercase and can only contain letters, numbers, and hyphens.",
    })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be string" })
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(2000, { message: "Description cannot exceed 2000 characters." }),
  projectLink: z
    .string({ invalid_type_error: "Blog link must be string" })
    .url({ message: "Blog link must be a valid URL." }),
  liveSite: z
    .string({ invalid_type_error: "Live site must be string" })
    .url({ message: "Live site must be a valid URL." }),
  features: z
    .array(z.string({ invalid_type_error: "Each feature must be string" }), {
      invalid_type_error: "Features must be an array of strings",
    })
    .min(1, { message: "At least one feature is required." })
    .max(20, { message: "Cannot have more than 20 features." }),
  techStack: z
    .array(
      z.string({ invalid_type_error: "Each tech stack item must be string" }),
      {
        invalid_type_error: "Tech stack must be an array of strings",
      }
    )
    .min(1, { message: "At least one tech stack item is required." })
    .max(30, { message: "Cannot have more than 30 tech stack items." }),
  isFeatured: z
    .boolean({ invalid_type_error: "isFeatured must be true or false" })
    .optional(),
  isPublished: z
    .boolean({ invalid_type_error: "isPublished must be true or false" })
    .optional(),
});

export const updateBlogZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be string" })
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(200, { message: "Title cannot exceed 200 characters." })
    .optional(),
  slug: z
    .string({ invalid_type_error: "Slug must be string" })
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(200, { message: "Slug cannot exceed 200 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must be lowercase and can only contain letters, numbers, and hyphens.",
    })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be string" })
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(2000, { message: "Description cannot exceed 2000 characters." })
    .optional(),
  projectLink: z
    .string({ invalid_type_error: "Blog link must be string" })
    .url({ message: "Blog link must be a valid URL." })
    .optional(),
  liveSite: z
    .string({ invalid_type_error: "Live site must be string" })
    .url({ message: "Live site must be a valid URL." })
    .optional(),
  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be string" })
    .url({ message: "Thumbnail must be a valid URL." })
    .optional(),
  features: z
    .array(z.string({ invalid_type_error: "Each feature must be string" }), {
      invalid_type_error: "Features must be an array of strings",
    })
    .min(1, { message: "At least one feature is required." })
    .max(20, { message: "Cannot have more than 20 features." })
    .optional(),
  techStack: z
    .array(
      z.string({ invalid_type_error: "Each tech stack item must be string" }),
      {
        invalid_type_error: "Tech stack must be an array of strings",
      }
    )
    .min(1, { message: "At least one tech stack item is required." })
    .max(30, { message: "Cannot have more than 30 tech stack items." })
    .optional(),
  isFeatured: z
    .boolean({ invalid_type_error: "isFeatured must be true or false" })
    .optional(),
  isPublished: z
    .boolean({ invalid_type_error: "isPublished must be true or false" })
    .optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),
});
