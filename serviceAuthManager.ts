import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import fastifyBearerAuth from '@fastify/bearer-auth';
import fastifyAuth from '@fastify/auth';
import fastifyPlugin from 'fastify-plugin';
import * as dotenv from 'dotenv';
import { IServiceBearerToken } from './types';

dotenv.config();

//Make bearer auth tpken system dynamically safe

/*
 * TODO
 *  1. create service in controllers
 *  2. Create table in db and do migrations
 *
 *
 * */

const verifyServiceBearerToken = (key: string, request: FastifyRequest) => {
  if (!key) return false;
  if (key) {
    const { knex } = request.server as FastifyInstance;
    return knex('serviceBearerTokens')
      .select()
      .where('token', key)
      .timeout(1000, { cancel: true })
      .then((serviceBearerToken: IServiceBearerToken) => {
        if (serviceBearerToken.token.length > 0) return true;
        return false;
      })
      .catch((error: unknown) => {
        return false;
      });
  }
};

const keys = [process.env.API_AUTH_TOKEN as string];

const authorizedKeysSet = new Set(keys);

module.exports = fastifyPlugin(async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify
    .register(fastifyAuth)
    .register(fastifyBearerAuth, {
      addHook: false,
      keys: authorizedKeysSet,
      verifyErrorLogLevel: 'debug',
      auth: verifyServiceBearerToken,
    });
  fastify.decorate('authenticate', async function (request: any, reply: FastifyReply) {
    console.log('KEYS', keys);
    try {
      await request.apiKeyVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
