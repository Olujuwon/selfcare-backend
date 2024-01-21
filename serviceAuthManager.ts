import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import fastifyBearerAuth from '@fastify/bearer-auth';
import fastifyAuth from '@fastify/auth';
import fastifyPlugin from 'fastify-plugin';
import * as dotenv from 'dotenv';
import { isEqual } from 'lodash';

dotenv.config();

const verifyServiceBearerToken = async (key: string, request: FastifyRequest): Promise<boolean> => {
  if (key) {
    try {
      const { knex } = request.server as FastifyInstance;
      const tokenExists = await knex('servicebearertokens')
        .select()
        .where('token', JSON.stringify(key))
        .timeout(1000, { cancel: true });
      return isEqual(tokenExists[0].token, key);
    } catch (error: unknown) {
      return false;
    }
  } else {
    return false;
  }
};

const keys = [process.env.API_AUTH_TOKEN as string];

const authorizedKeysSet = new Set(keys);

module.exports = fastifyPlugin(async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.register(fastifyAuth).register(fastifyBearerAuth, {
    addHook: false,
    keys: authorizedKeysSet,
    verifyErrorLogLevel: 'debug',
    auth: verifyServiceBearerToken,
  });
  /*fastify.decorate('authenticate', async function (request: any, reply: FastifyReply) {
    try {
      /!*await request.apiKeyVerify();*!/
    } catch (err) {
      reply.send(err);
    }
  });*/
});
