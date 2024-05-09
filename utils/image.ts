import cheerio from 'cheerio';
export async function replaceImgSrcWithBlobUrl(html: string) {
  const $ = cheerio.load(html);

  const imgPromises = $('img')
    .map((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        return urlToBlob(src).then((blobUrl) => {
          $(element).attr('src', blobUrl);
        });
      }
      return Promise.resolve();
    })
    .get();

  await Promise.all(imgPromises);

  return $.html();
}

const urlToBlob = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
};
