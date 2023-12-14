import { FastifyInstance, FastifyReply, FastifyRequest, RequestParamsDefault } from 'fastify';
import { ITask } from '../../types';

export const queryAll = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = process.env.SERVICE_NAME;
  // @ts-ignore
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

export const queryByUserId = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = process.env.SERVICE_NAME;
  // @ts-ignore
  const { knex } = request.server as FastifyInstance;
  // @ts-ignore
  const { userId } = request.params as RequestParamsDefault;
  try {
    const getAllByUserId = await knex(_serviceName)
      .select()
      .where('user_id', '=', Number(userId))
      .timeout(1000, { cancel: true });
    reply.code(200).send({
      version: _version,
      data: getAllByUserId,
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

export const queryById = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = process.env.SERVICE_NAME;
  // @ts-ignore
  const { knex } = request.server as FastifyInstance;
  // @ts-ignore
  const { id } = request.params as RequestParamsDefault;
  try {
    const getOneById = await knex(_serviceName).select().where('id', '=', Number(id)).timeout(1000, { cancel: true });

    reply.code(200).send({
      version: _version,
      data: getOneById,
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

export const insertNew = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = process.env.SERVICE_NAME;
  // @ts-ignore
  const { knex } = request.server as FastifyInstance;
  try {
    const insertNewQuery = await knex(_serviceName).insert(request.body, ['id']);
    reply.code(201).send({
      version: _version,
      data: insertNewQuery,
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

export const updateById = async (request: FastifyRequest, reply: FastifyReply) => {
  const _version = process.env.VERSION;
  const _serviceName = process.env.SERVICE_NAME;
  // @ts-ignore
  const { knex } = request.server as FastifyInstance;
  const updateObject = request.body as ITask;
  // @ts-ignore
  const { id } = request.params as RequestParamsDefault;
  for (const key in updateObject) {
    if (key === 'id' || key === 'created_at' || key === 'updated_at') {
      delete updateObject[key];
    }
  }
  try {
    updateObject.updated_at = new Date();
    const updateQuery = await knex(_serviceName)
      .where('id', '=', Number(id))
      .update(updateObject, ['id', 'updated_at']);
    reply.code(200).send({
      version: _version,
      data: updateQuery,
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
  const _serviceName = process.env.SERVICE_NAME;
  // @ts-ignore
  const { knex } = request.server as FastifyInstance;
  // @ts-ignore
  const { id } = request.params as RequestParamsDefault;
  try {
    const deleteQuery = await knex(_serviceName).where('id', '=', Number(id)).del(['id']);
    reply.code(200).send({
      version: _version,
      data: deleteQuery,
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
