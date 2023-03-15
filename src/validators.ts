import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const projectSchema = z.object({
  name: z.string(),
});

export const peopleSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().min(10).max(10),
});

export const voteProjectSchema = z.object({
  projectId: z.string(),
  token: z.string().toLowerCase(),
});

export type LoginUserCredentialsDTO = z.infer<typeof loginUserSchema>;
export type PeopleCredentialsDTO = z.infer<typeof peopleSchema>;
export type NewProjectCredentialsDTO = z.infer<typeof projectSchema>;
export type VoteProjectCredentialsDTO = z.infer<typeof voteProjectSchema>;
