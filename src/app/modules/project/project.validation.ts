import z from "zod";

export const createProjectZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be string" })
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(200, { message: "Title cannot exceed 200 characters." }),
  description: z
    .string({ invalid_type_error: "Description must be string" })
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(2000, { message: "Description cannot exceed 2000 characters." }),
  projectLink: z
    .string({ invalid_type_error: "Project link must be string" })
    .url({ message: "Project link must be a valid URL." }),
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
    .max(20, { message: "Cannot have more than 20 tech stack items." }),
  isFeatured: z
    .boolean({ invalid_type_error: "isFeatured must be true or false" })
    .optional(),
  isPublished: z
    .boolean({ invalid_type_error: "isPublished must be true or false" })
    .optional(),
});

export const updateProjectZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be string" })
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(200, { message: "Title cannot exceed 200 characters." })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be string" })
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(2000, { message: "Description cannot exceed 2000 characters." })
    .optional(),
  projectLink: z
    .string({ invalid_type_error: "Project link must be string" })
    .url({ message: "Project link must be a valid URL." })
    .optional(),
  liveSite: z
    .string({ invalid_type_error: "Live site must be string" })
    .url({ message: "Live site must be a valid URL." })
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
