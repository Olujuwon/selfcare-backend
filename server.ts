import Fastify from 'fastify';
import * as dotenv from 'dotenv';
import tasksRoutes from './routes/v1/tasks';
import usersRoutes from './routes/v1/users';
import cors from '@fastify/cors';
import fastifyFirebase from 'fastify-firebase';

dotenv.config();

const serverHealth = require('server-health');
const firebaseJsonCert = JSON.parse(process.env.FIREBASE_CERT as string);
const fastify = Fastify({
  logger: true,
});
const port = process.env.PORT ? Number(process.env.PORT) : 8002;

fastify.register(cors, { hook: 'preHandler' });
fastify.register(require('fastify-knexjs'), {
  client: 'pg',
  version: '15',
  connection:
    process.env.APP_CONTEXT === 'develop' ? process.env.TEST_DB_CONNECTION_STRING : process.env.DB_CONNECTION_STRING,
});
fastify.register(fastifyFirebase, firebaseJsonCert as never);
//fastify.register(require('./initDb'), { serviceName: process.env.SERVICE_NAME });
fastify.register(require('./serviceAuthManager'));

serverHealth.addConnectionCheck('database', async () => {
  const _serviceName = process.env.SERVICE_NAME;
  try {
    const exists = await fastify.knex.schema.hasTable(_serviceName);
    return !!exists;
  } catch (err: any) {
    fastify.log.info(err.message);
    return false;
  }
});

serverHealth.exposeHealthEndpoint(fastify, '/v1/health', 'fastify');

// Default route
fastify.get('/', async (request, reply) => {
  return reply.code(200).send({
    version: process.env.VERSION,
    status: 200,
    message: `Use /v1/${process.env.SERVICE_NAME} to access the service`,
  });
});
// Error route
fastify.get('*', (request, reply) => {
  return reply.code(404).send({
    version: process.env.VERSION,
    status: 404,
    message: 'The requested route does not exist',
  });
});

// Service routes
fastify.register(tasksRoutes);
fastify.register(usersRoutes);

fastify.setErrorHandler(function (error, request, reply) {
  if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    // Log error
    this.log.error(error);
    // Send error response
    reply.status(500).send({ ok: false });
  } else {
    // fastify will use parent error handler to handle this
    reply.send(error);
  }
});

// Run the server!
fastify.listen({ port: port, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // @ts-ignore
  //fastify.initializeDatabaseTableWithBaseSettings();
  fastify.log.info(`server listening on ${address}`);
});
