import { promises as fs } from 'fs';
import toIco from 'to-ico';

const inputPNG = 'public/favicon/favicon-32x32.png';
const outputICO = 'public/favicon/favicon.ico';

async function convert() {
  try {
    const buffer = await fs.readFile(inputPNG);

    const ico = await toIco([buffer]);

    await fs.writeFile(outputICO, ico);

    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error in conversion:', error);
  }
}

convert();
