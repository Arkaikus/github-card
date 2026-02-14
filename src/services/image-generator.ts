import satori from 'satori';
import { Resvg } from '@cf-wasm/resvg/workerd';
import type { GitHubUser, CommitData } from '../types/github.js';
import { themes } from '../themes.js';
import { generateCardTemplate } from '../templates/card-template.js';
import { loadFont } from '../utils/fonts.js';
import { getEmojiIconCode, loadEmoji } from '../utils/emoji.js';

export async function generateCardImage(
  user: GitHubUser,
  theme: keyof typeof themes,
  width: number,
  height: number,
  commitData: CommitData[] = []
): Promise<ArrayBuffer> {
  // Load font
  const fontData = await loadFont();

  // Generate SVG using Satori
  const template = generateCardTemplate(user, theme, width, height, commitData);
  const svg = await satori(template, {
    width,
    height,
    fonts: [
      {
        name: 'Inter',
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === 'emoji') {
        // Load emoji SVG from Twemoji
        const iconCode = getEmojiIconCode(segment);
        const svg = await loadEmoji(iconCode);
        if (svg) {
          return `data:image/svg+xml;base64,${btoa(svg)}`;
        }
      }
      return code;
    },
  });

  // Convert SVG to PNG using Resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
}
