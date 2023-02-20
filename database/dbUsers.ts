import bcrypt from 'bcryptjs';

import { db } from '@/database';
import { User } from '@/models';

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  await db.connect();
  const user = await User.findOne({ email }).lean();
  await db.disconnect();

  if (!user) return null;

  if (!bcrypt.compareSync(password, user.password!)) return null;

  const { role, name, _id } = user;

  return {
    id: _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};

/**
 * Create or verify Oauth user
 */
export const oauthToDBUser = async (oauthEmail: string, oauthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oauthEmail });

  if (user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return { _id, name, email, role };
  }

  const newUser = new User({
    email: oauthEmail,
    name: oauthName,
    password: '@',
    role: 'client',
  });
  await newUser.save();
  await db.disconnect();

  const { _id, name, email, role } = newUser;
  return { _id, name, email, role };
};
