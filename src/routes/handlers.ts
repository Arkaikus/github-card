import type { Context } from 'hono';
import { docHTML } from '../doc-template.js';
import { fetchGitHubUser } from '../services/github.js';
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

  // Fetch user data
  const user = await fetchGitHubUser(username!);
  if (!user) {
    return c.text('User not found', 404);
  }

  try {
    // Generate card image
    const pngBuffer = await generateCardImage(
      user,
      queryParams.theme,
      queryParams.width,
      queryParams.height
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
