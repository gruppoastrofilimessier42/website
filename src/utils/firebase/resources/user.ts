import { z } from "zod";

type UserBase = {
  email: string,
  name: string;
  surname: string;
}

export type UserRequest = UserBase & {
  type: string;
  password: string,
}

export type UserResource = UserBase & {
  id: string;
  type: {
    id: string,
    name: string,
    reservationLimit: number,
    sleepingLimit: number
  }
}

const UserBaseSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string()
});

export const userResourceSchema = UserBaseSchema.merge(
  z.object({
    id: z.string(),
    type: z.object({
      id: z.string(),
      name: z.string(),
      reservationLimit: z.number(),
      sleepingLimit: z.number()
    })
  })
);

export const userRequestSchema = UserBaseSchema.merge(
  z.object({
    type: z.string(),
    password: z.string(),
  })
);