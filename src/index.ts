import { Hono } from 'hono';
import { redirectToDoc, showDocumentation, getUsername } from './routes/handlers.js';

export default {
  async fetch(request, env, ctx): Promise<Response> {
    // Initialize Hono app
    const app = new Hono();

    // Define routes
    app.get('/', redirectToDoc);
    app.get('/doc', showDocumentation);
    app.get('/:username', getUsername);

    return app.fetch(request);
  },
} satisfies ExportedHandler<Env>;
