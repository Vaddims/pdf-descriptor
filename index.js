const fs = require('fs').promises;
const { fromPath } = require('pdf2pic');
const { createWorker } = require('tesseract.js');

const convertPDFToImage = async (pdfPath, options) => {
  const convert = fromPath(pdfPath, options);
  const pageToConvertAsImage = 1;
  console.log('Converting PDF to image')
  return await convert(pageToConvertAsImage, { responseType: "image" });
}

const extractTextFromImage = async () => {
  const langCode = 'eng';
  console.log(`Extracting text from image ${langCode}`);
  const worker = await createWorker(langCode);
  const ret = await worker.recognize('./runtime/output.1.png');
  await worker.terminate();
  return ret.data.text;
}

const saveTextToFile = async (fileName, text) => {
  await fs.writeFile(`./runtime/${fileName}.txt`, text, {
    encoding: 'utf8',
  });
}

const aiResponse = async (text) => {
  return await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3',
      stream: false,
      messages: [
        {
          role: 'user',
          content: `You are a pdf descriptor. Describe the contents of this pdf as precise as possible, without responding with anything else but the description. If some data is corrupted, try to guess it. Start the text with "This document is". The data:\n\n${text}`
        }
      ],
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


const run = async (filePath) => {
  const options = {
    density: 300,
    width: 1920,
    height: 1920,
    preserveAspectRatio: true,
    quality: 100,
    saveFilename: 'output',
    savePath: './runtime',
  }

  await convertPDFToImage(filePath, options);
  const text = await extractTextFromImage()

  try {
    console.log('Creating a "runtime" folder. You will be able to find the output files there')
    await fs.mkdir('./runtime');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }

  console.log('Clearing up');
  await fs.unlink('./runtime/output.1.png');

  if (text) {
    console.log('Writing text to file')
    await saveTextToFile('extract-output', text);

    console.log('Describing the document with llama3')
    const response = await (await aiResponse(text)).json();
    await saveTextToFile('result-output', response.message.content);
    console.log('Result saved to file')
  } else {
    console.log('No text to save')
  }

  process.exit(0);
}

run(process.argv[2]);