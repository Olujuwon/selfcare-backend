import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { IServiceBearerToken, IUser } from '../../types';
import { JwtPayload } from 'jsonwebtoken';

dotenv.config();

export const createServiceBearerToken = (user: IUser, expires?: string): IServiceBearerToken => {
  const token = jwt.sign({ data: user }, process.env.JWT_SECRET as string, {
    expiresIn: expires ? expires : '24h',
    issuer: 'Selfcare app',
  });
  return {
    token: token,
    user_id: user.id as string,
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
  };
};

export const decodeServiceBearerToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  try {
    const decoded = decodeServiceBearerToken(accessToken) as JwtPayload;
    const currentTime = Date.now() / 1000;
    return (decoded.exp as number) > currentTime;
  } catch (e) {
    return false;
  }
};
