import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { IServiceBearerToken, IUser } from '../../types';

dotenv.config();

export const createServiceBearerToken = (user: IUser): IServiceBearerToken => {
  const token = jwt.sign({ data: user }, process.env.JWT_SECRET as string, {
    expiresIn: '24h',
    issuer: 'Selfcare app',
  });
  return {
    token: token,
    id: '1',
    user_id: user.id as string,
    created_at: new Date(),
    updated_at: new Date(),
  };
};
