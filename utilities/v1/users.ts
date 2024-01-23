import { IServiceBearerToken, IUser } from '../../types';
import { createServiceBearerToken, isValidToken } from './servicebearertokens';

export const insertTokenToDb = async (knex: any, token: IServiceBearerToken): Promise<void> => {
  try {
    await knex('servicebearertokens').insert({ ...token, token: JSON.stringify(token.token) });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteToken = async (knex: any, token: IServiceBearerToken): Promise<void> => {
  try {
    await knex('servicebearertokens')
      .where({ id: token.id, token: JSON.stringify(token.token) })
      .update({ status: 'deleted' });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const tokenExists = async (knex: any, user_id: string): Promise<IServiceBearerToken[]> => {
  try {
    return await knex('servicebearertokens').select().where({
      user_id: user_id,
      status: 'active',
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const userExistsById = async (knex: any, user_id: string): Promise<IUser[]> => {
  try {
    return await knex('users').column('id', 'display_name', 'email', 'photo_url').select().where({
      id: user_id,
      status: 'active',
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const verifyAndGenerateBearerToken = async (knex: any, user: any): Promise<any> => {
  let _token: IServiceBearerToken;
  const deletePromise: Promise<any>[] = [];
  try {
    const existingTokens = await tokenExists(knex, user.id);
    if (existingTokens.length > 0) {
      for (const token of existingTokens) {
        if (isValidToken(token.token) && token.status === 'active') {
          token;
        } else {
          deletePromise.push(deleteToken(knex, token));
        }
      }
      await Promise.all([...deletePromise]);
      _token = createServiceBearerToken(user);
      await insertTokenToDb(knex, _token);
      return _token;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
