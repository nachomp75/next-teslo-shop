import type { NextApiRequest, NextApiResponse } from 'next';

import { isValidObjectId } from 'mongoose';

import { db } from '@/database';
import { User } from '@/models';
import { IUser } from '@/interfaces';

type Data = { message: string } | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getUsers(res);

    case 'PUT':
      return updateUser(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getUsers = async (res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await User.find().select('-password').lean();
  await db.disconnect();

  return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = '' } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'There is no user with this id' });
  }

  const validRoles = ['admin', 'client', 'super-user', 'SEO'];
  if (!validRoles.includes(role)) {
    return res
      .status(400)
      .json({ message: `Not valid role: ${validRoles.join(', ')}` });
  }

  await db.connect();
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: `User not found: ${userId}` });
  }
  user.role = role;
  await user.save();
  await db.disconnect();

  return res.status(200).json({ message: 'User updated' });
};
