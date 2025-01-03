import { PrismaClient } from '@prisma/client';

import type { Response, Request } from 'express';

const prisma = new PrismaClient();

export async function getUsers(_req: Request, res: Response) {
  const user = await prisma.user.findMany();

  await prisma.$disconnect();

  res.status(200).json(user);
}

export async function createUser(req: Request, res: Response) {
  if (!req.body) {
    res.status(400).json({ error: 'Request body is required' });

    return;
  }

  if (Object.keys(req.body).length > 2) {
    res
      .status(400)
      .json({ error: 'Request body should have only name and email' });

    return;
  }

  if (
    Object.keys(req.body).some((key) => {
      return key !== 'name' && key !== 'email';
    })
  ) {
    res
      .status(400)
      .json({ error: 'Request body should have only name and email' });

    return;
  }

  if (req.body.name === '' || req.body.email === '') {
    res.status(400).json({ error: 'Name and email are required' });

    return;
  }

  const { email, name } = req.body;

  res.status(201).json({ email, name });
}
