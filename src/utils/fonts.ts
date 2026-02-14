// Load font for Satori
export async function loadFont(): Promise<ArrayBuffer> {
  const fontResponse = await fetch(
    'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-400-normal.woff'
  );
  const fontData = await fontResponse.arrayBuffer();
  return fontData;
}
