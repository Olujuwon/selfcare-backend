import { IServiceBearerToken, IUser } from '../../types';
import { createServiceBearerToken, isValidToken } from './servicebearertokens';

export const insertTokenToDb = async (knex: any, token: IServiceBearerToken) => {
  token = { ...token, token: JSON.stringify(token.token) };
  return await knex('servicebearertokens').insert(token);
};

export const deleteToken = async (knex: any, token: IServiceBearerToken) => {
  return await knex('servicebearertokens').where({ id: token.id, token: token.token }).update({ status: 'deleted' });
};

export const tokenExists = async (knex: any, user_id: string): Promise<IServiceBearerToken[]> => {
  return await knex('servicebearertokens').select().where({
    id: user_id,
    status: 'active',
  });
};

export const userExistsById = async (knex: any, user_id: string): Promise<IUser[]> => {
  return await knex('users').column('id', 'display_name', 'email', 'photo_url').select().where({
    id: user_id,
    status: 'active',
  });
};

export const verifyAndGenerateBearerToken = async (knex: any, user: any): Promise<any> => {
  const existingTokens = await tokenExists(knex, user.id);
  let _token: IServiceBearerToken;
  const deletePromise: Promise<any>[] = [];
  try {
    if (existingTokens.length > 0) {
      existingTokens.forEach(async (token) => {
        if (isValidToken(_token.token) && token.status === 'active') {
          return _token;
        } else {
          deletePromise.push(deleteToken(knex, token));
        }
      });
      await Promise.all(deletePromise);
    }
    _token = createServiceBearerToken(user);
    await insertTokenToDb(knex, _token);
    return _token;
  } catch (error: any) {
    return { error: error.message };
  }
};
