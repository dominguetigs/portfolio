import { promises as fs } from 'fs';
import sharp from 'sharp';

async function convertSvgToPng() {
  try {
    const conversions = [
      {
        input: 'public/pi-g-favicon.svg',
        outputs: [
          { path: 'public/favicon-16x16.png', size: 16 },
          { path: 'public/favicon-32x32.png', size: 32 },
          { path: 'public/apple-touch-icon.png', size: 180 },
        ],
      },
      {
        input: 'public/pi-g-favicon-dark.svg',
        outputs: [
          { path: 'public/favicon-16x16-dark.png', size: 16 },
          { path: 'public/favicon-32x32-dark.png', size: 32 },
        ],
      },
    ];

    for (const conversion of conversions) {
      console.log(`Converting ${conversion.input}...`);

      const svgBuffer = await fs.readFile(conversion.input);

      for (const output of conversion.outputs) {
        console.log(
          `- Generating ${output.path} (${output.size}x${output.size})`,
        );

        await sharp(svgBuffer)
          .resize(output.size, output.size)
          .png()
          .toFile(output.path);
      }
    }

    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error in conversion:', error);
  }
}

convertSvgToPng();
