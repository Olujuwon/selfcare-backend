import { type FastifyInstance } from 'fastify';
import { deleteById, updateById, insertNew, queryById, signIn } from '../../controllers/v1/users';
import { FastifyRouteConfig } from 'fastify/types/route';

const signInEndpoint = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              display_name: { type: 'string' },
              photo_url: { type: 'string' },
              phone_number: { type: 'string' },
              token: { type: 'string' },
            },
          },
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
  handler: signIn,
};

const signUpEndpoint = {
  schema: {
    body: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
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

const getByIdEndpoint = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              display_name: { type: 'string' },
              photo_url: { type: 'string' },
              phone_number: { type: 'string' },
            },
          },
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

const updateByIdEndpoint = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              display_name: { type: 'string' },
              photo_url: { type: 'string' },
              phone_number: { type: 'string' },
            },
          },
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
        id: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          data: { type: 'string' },
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

export const usersRoutes = async (fastify: FastifyInstance, options: FastifyRouteConfig) => {
  const _serviceName = 'users';
  fastify.addHook('preHandler', fastify.auth([fastify.verifyBearerAuth as never]));
  fastify.get(`/v1/${_serviceName}/:id`, getByIdEndpoint);
  fastify.patch(`/v1/${_serviceName}/:id`, updateByIdEndpoint);
  fastify.delete(`/v1/${_serviceName}/:id`, deleteByIdEndpoint);
};

export const authRoutes = async (fastify: FastifyInstance, options: FastifyRouteConfig) => {
  const _serviceName = 'auth';
  fastify.post(`/v1/${_serviceName}/signin`, signInEndpoint);
  fastify.post(`/v1/${_serviceName}`, signUpEndpoint);
};
