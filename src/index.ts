import { Hono } from 'hono';
import { redirectToDoc, showDocumentation, getUsername } from './routes/handlers.js';

export default {
  async fetch(request, env, ctx): Promise<Response> {
    // Initialize Hono app with env
    const app = new Hono<{ Bindings: Env }>();

    // Define routes
    app.get('/', redirectToDoc);
    app.get('/doc', showDocumentation);
    app.get('/:username', getUsername);

    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
