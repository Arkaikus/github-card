import type { Context } from 'hono';
import { docHTML } from '../doc-template.js';
import { fetchGitHubUser, fetchGitHubEvents, processCommitData } from '../services/github.js';
import { generateCardImage } from '../services/image-generator.js';
import {
  validateUsername,
  validateDimensions,
  parseQueryParams,
} from './validation.js';

export const redirectToDoc = (c: Context) => {
  return c.redirect('/doc');
};

export const showDocumentation = (c: Context) => {
  return c.html(docHTML);
};

export const getUsername = async (c: Context) => {
  const username = c.req.param('username');
  const queryParams = parseQueryParams({
    width: c.req.query('width'),
    height: c.req.query('height'),
    theme: c.req.query('theme'),
  });

  // Validate username
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.isValid) {
    return c.text(usernameValidation.error!, 400);
  }

  // Validate dimensions
  const dimensionsValidation = validateDimensions(
    queryParams.width,
    queryParams.height
  );
  if (!dimensionsValidation.isValid) {
    return c.text(dimensionsValidation.error!, 400);
  }

  // Fetch user data and events in parallel with KV caching
  const cache = c.env.GITHUB_CACHE;
  const [user, events] = await Promise.all([
    fetchGitHubUser(username!, cache),
    fetchGitHubEvents(username!, cache),
  ]);

  if (!user) {
    return c.text('User not found', 404);
  }

  // Process commit data
  const commitData = processCommitData(events);

  try {
    // Generate card image
    const pngBuffer = await generateCardImage(
      user,
      queryParams.theme,
      queryParams.width,
      queryParams.height,
      commitData
    );

    // Return PNG image
    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating card:', error);
    return c.text('Error generating card', 500);
  }
};
