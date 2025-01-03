import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import type { Response, Request } from 'express';

const prisma = new PrismaClient();

export async function getUsers(_req: Request, res: Response) {
  const user = await prisma.user.findMany();

  await prisma.$disconnect();

  res.status(200).json(user);
}

export async function createUser(req: Request, res: Response) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  return new Promise<z.infer<typeof bodySchema>>((resolve) =>
    resolve(bodySchema.parse(req.body))
  )
    .then(async (user) => {
      const userExists = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (userExists) {
        throw new Error('1');
      } else {
        return user;
      }
    })
    .then(async (user) => {
      const newUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
        },
      });

      await prisma.$disconnect();

      res.status(201).json({ name: newUser.name, email: newUser.email });
    })
    .catch(async (error) => {
      await prisma.$disconnect();

      if (error.message === '1') {
        res.status(409).json({ error: 'User already exists' });

        return;
      }

      res.status(400).json({ error: 'Invalid data' });
    });
}
