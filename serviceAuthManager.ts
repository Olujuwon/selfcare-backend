import { FastifyInstance, FastifyPluginOptions, FastifyReply } from 'fastify';
import fastifyBearerAuth from '@fastify/bearer-auth';
import fastifyAuth from '@fastify/auth';
import fastifyPlugin from 'fastify-plugin';
import * as dotenv from 'dotenv';

dotenv.config();

const keys = [process.env.API_AUTH_TOKEN as string];

const authorizedKeysSet = new Set(keys);

module.exports = fastifyPlugin(async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify
    .register(fastifyAuth)
    .register(fastifyBearerAuth, { addHook: false, keys: authorizedKeysSet, verifyErrorLogLevel: 'debug' });
  fastify.decorate('authenticate', async function (request: any, reply: FastifyReply) {
    console.log('KEYS', keys);
    try {
      await request.apiKeyVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
