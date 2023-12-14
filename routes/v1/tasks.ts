import { type FastifyInstance } from 'fastify';
import { deleteById, updateById, insertNew, queryById, queryAll, queryByUserId } from '../../controllers/v1/tasks';
import { FastifyRouteConfig } from 'fastify/types/route';

const getAllEndpoint = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: { type: 'array' },
          status: { type: 'integer' },
        },
      },
      401: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          error: { type: 'string' },
          status: { type: 'integer' },
        },
      },
    },
  },
  handler: queryAll,
};

const getByIdEndpoint = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: { type: 'array' },
          status: { type: 'integer' },
        },
      },
      401: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          error: { type: 'string' },
          status: { type: 'integer' },
        },
      },
    },
  },
  handler: queryById,
};

const getAllByUserIdEndpoint = {
  schema: {
    params: {
      type: 'object',
      properties: {
        userId: { type: 'integer' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: { type: 'array' },
          status: { type: 'integer' },
        },
      },
      401: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          error: { type: 'string' },
          status: { type: 'integer' },
        },
      },
    },
  },
  handler: queryByUserId,
};

const createNewEndpoint = {
  schema: {
    body: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          schedule: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string' },
          user_id: { type: 'integer' },
        },
      },
      maxItems: 999,
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: { type: 'array' },
          status: { type: 'integer' },
        },
      },
      401: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          error: { type: 'string' },
          status: { type: 'integer' },
        },
      },
    },
  },
  handler: insertNew,
};

const updateByIdEndpoint = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: { type: 'array' },
          status: { type: 'integer' },
        },
      },
      401: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          error: { type: 'string' },
          status: { type: 'integer' },
        },
      },
    },
  },
  handler: updateById,
};

const deleteByIdEndpoint = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: { type: 'array' },
          status: { type: 'integer' },
        },
      },
      401: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          error: { type: 'string' },
          status: { type: 'integer' },
        },
      },
    },
  },
  handler: deleteById,
};

const tasksRoutes = async (fastify: FastifyInstance, options: FastifyRouteConfig) => {
  const _serviceName = process.env.SERVICE_NAME;
  fastify.addHook('preHandler', fastify.auth([fastify.verifyBearerAuth as never]));
  fastify.get(`/v1/${_serviceName}`, getAllEndpoint);
  fastify.get(`/v1/${_serviceName}/:id`, getByIdEndpoint);
  fastify.get(`/v1/${_serviceName}/getByUserId/:userId`, getAllByUserIdEndpoint);
  fastify.post(`/v1/${_serviceName}`, createNewEndpoint);
  fastify.patch(`/v1/${_serviceName}/:id`, updateByIdEndpoint);
  fastify.delete(`/v1/${_serviceName}/:id`, deleteByIdEndpoint);
};

export default tasksRoutes;
