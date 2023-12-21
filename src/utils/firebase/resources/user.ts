import { z } from "zod";

export type UserResource = {
  name: string;
  surname: string;
}

export const userSchema = z.object({
  name: z.string(),
  surname: z.string()
});