import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import * as dotenv from 'dotenv';
import { IUser } from '../../types';
import { createServiceBearerToken } from '../../utilities/v1/servicebearertokens';
import bcrypt from 'bcrypt';
import { sendEmailMessage } from '../../email';
import { signupEmailTemplate, resetEmailTemplate } from '../../email/emailMessageObjectTemplates';
import { insertTokenToDb, userExistsById, verifyAndGenerateBearerToken } from '../../utilities/v1/users';

dotenv.config();

export const insertNew = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = 'users';
  const { knex } = request.server as FastifyInstance;
  const usersWithEncryptedPass = [...(request.body as IUser[])].map((user) => {
    const hash = bcrypt.hashSync(user.password as string, 10);
    return { ...user, password: hash };
  });
  try {
    const usersCreated = await knex(_serviceName).insert(usersWithEncryptedPass, ['id', 'display_name', 'email']);
    const sendEmailPromises: Promise<any>[] = [];
    usersCreated.forEach((user: IUser) => {
      const emailMessage = { ...signupEmailTemplate };
      emailMessage.personalizations[0].to[0].email = user.email;
      emailMessage.personalizations[0].to[0].name = user.display_name;
      emailMessage['-buttonUrl-'] = `${process.env.RESET_PASSWORD_URL}${user.id}`;
      sendEmailPromises.push(sendEmailMessage(emailMessage));
    });
    await Promise.all(sendEmailPromises);
    reply.log.info('New user(s) account created successfully', usersCreated);
    reply.code(201).send({
      version: _version,
      data: usersCreated,
      status: 201,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = 'users';
  const { email, password } = request.body as any;
  const { knex } = request.server as FastifyInstance;
  try {
    const authenticatedUserQuery = await knex(_serviceName)
      .column('id', 'display_name', 'email', 'photo_url', 'password')
      .select()
      .where({
        email: email,
        status: 'active',
      });
    const authenticatedUser = authenticatedUserQuery[0];
    const isPasswordValid = await bcrypt.compare(password, authenticatedUser.password);
    if (!isPasswordValid) throw new Error('Invalid password');
    delete authenticatedUser.password;
    const serviceBearerToken = await verifyAndGenerateBearerToken(knex, authenticatedUser);
    if ((serviceBearerToken as any).error) throw new Error((serviceBearerToken as any).error);
    authenticatedUser.token = serviceBearerToken.token;
    reply.log.info('User login successfully', authenticatedUser.id);
    reply.code(200).send({
      version: _version,
      data: authenticatedUser,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.log.error('User login ERROR', _code, error.message);
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};

export const queryById = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = 'users';
  const { knex } = request.server as FastifyInstance;
  const { id } = request.params as any;
  try {
    const user = await knex(_serviceName).column('id', 'display_name', 'email', 'photo_url').select().where({
      id: id,
      status: 'active',
    });
    reply.code(200).send({
      version: _version,
      data: user[0],
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};

export const sendUserPasswordResetLink = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const { knex } = request.server as FastifyInstance;
  const { id } = request.params as any;
  try {
    const getUserIfUserExists = await userExistsById(knex, id);
    const token = createServiceBearerToken(getUserIfUserExists[0], '1h');
    await insertTokenToDb(knex, token);
    const emailMessage = { ...resetEmailTemplate };
    emailMessage.personalizations[0].to[0].email = getUserIfUserExists[0].email;
    emailMessage.personalizations[0].to[0].name = getUserIfUserExists[0].display_name;
    emailMessage.buttonUrl = `${process.env.RESET_PASSWORD_URL}${token}`;
    await sendEmailMessage(emailMessage);
    reply.log.info('Password reset link sent!', getUserIfUserExists[0].email);
    reply.code(200).send({
      version: _version,
      data: 'Password reset link sent!',
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.log.error('Password reset link NOT sent!', _code, error.message);
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};

export const queryAll = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = 'users';
  const { knex } = request.server as FastifyInstance;
  try {
    const queryAll = await knex(_serviceName).select().timeout(1000, { cancel: true });
    reply.code(200).send({
      version: _version,
      data: queryAll,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};

export const updateById = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = 'users';
  const { knex } = request.server as FastifyInstance;
  const updateObject = request.body as IUser;
  const { id } = request.params as any;
  for (const key in updateObject) {
    if (key === 'id' || key === 'created_at' || key === 'updated_at') {
      delete updateObject[key];
    }
  }
  try {
    updateObject.updated_at = new Date();
    const updatedUser = await knex(_serviceName)
      .where('id', '=', Number(id))
      .update(updateObject, ['id', 'updated_at']);
    reply.code(200).send({
      version: _version,
      data: updatedUser,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};

export const deleteById = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = 'users';
  const { knex } = request.server as FastifyInstance;
  const { id } = request.params as any;
  try {
    await knex(_serviceName).where('id', '=', Number(id)).del(['id']);
    reply.code(200).send({
      version: _version,
      data: `User with ID ${id} deleted successfully`,
      status: 200,
    });
  } catch (error: any) {
    const _code = reply.statusCode >= 299 ? 500 : 400;
    reply.code(_code).send({
      error: error.message,
      version: _version,
      status: _code,
    });
  }
};
