import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions } from 'fastify';

const fp = require('fastify-plugin');

function initializeDatabaseTableWithBaseSettingsPlugin(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: FastifyPluginCallback
) {
  fastify.decorate('initializeDatabaseTableWithBaseSettings', async () => {
    const { serviceName } = opts;
    // @ts-ignore
    const { knex } = fastify;
    try {
      // @ts-ignore
      const exists = await knex.schema.hasTable(serviceName);
      if (!exists) {
        fastify.log.info('Database Table with name ' + serviceName + ' exists ==> ' + exists);
      }
      fastify.log.info('Database Table with name ' + serviceName + ' exists ==> ' + exists);
      return exists;
    } catch (error: any) {
      fastify.log.error('Error in database ' + serviceName, error.message);
      throw new Error(error.message);
    }
  });
  // @ts-ignore
  done();
}

module.exports = fp(initializeDatabaseTableWithBaseSettingsPlugin, { fastify: '>=1.0.0', name: 'database-plugin' });
