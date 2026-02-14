// Convert emoji to Twemoji icon code
export function getEmojiIconCode(emoji: string): string {
  const codePoints: string[] = [];
  for (let i = 0; i < emoji.length; i++) {
    const codePoint = emoji.codePointAt(i);
    if (codePoint) {
      codePoints.push(codePoint.toString(16));
      // Skip the next character if it's a surrogate pair
      if (codePoint > 0xffff) {
        i++;
      }
    }
  }
  return codePoints.join('-');
}

// Load emoji SVG from Twemoji CDN
export async function loadEmoji(code: string): Promise<string> {
  const response = await fetch(
    `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`
  );
  if (!response.ok) {
    // Return empty string if emoji not found
    return '';
  }
  return response.text();
}
