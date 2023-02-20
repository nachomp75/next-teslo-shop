import type { NextApiRequest, NextApiResponse } from 'next';

import bcrypt from 'bcryptjs';

import { db } from '@/database';
import { User } from '@/models';
import { jwt, validations } from '@/utils';

type Data =
  | { message: string }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {
    email = '',
    password = '',
    name = '',
  } = req.body as {
    email: string;
    password: string;
    name: string;
  };

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must have 6 or more characters' });
  }

  if (name.length < 2) {
    return res
      .status(400)
      .json({ message: 'Name must have 6 or more characters' });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: 'Email not valid' });
  }

  await db.connect();
  const user = await User.findOne({ email });

  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: 'Email already used' });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
    await db.disconnect();
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({
      message: 'Check server logs',
    });
  }

  const { _id, role } = newUser;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: { email, role, name },
  });
};
