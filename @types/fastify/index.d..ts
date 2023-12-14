import fastify from 'fastify';

declare module 'fastify' {
  export interface FastifyInstance<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> {
    port: number;
    auth: function;
    knex: any;
    verifyBearerAuth: function;
  }
}
