import sharp from 'sharp';

export async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Calculate dimensions for high-res mode
    let width = metadata.width || 0;
    let height = metadata.height || 0;
    
    // Ensure image fits within 2048x2048
    if (width > 2048 || height > 2048) {
      const aspectRatio = width / height;
      if (width > height) {
        width = 2048;
        height = Math.round(2048 / aspectRatio);
      } else {
        height = 2048;
        width = Math.round(2048 * aspectRatio);
      }
    }

    // Ensure shortest side is 768px max
    if (width < height && width > 768) {
      height = Math.round((height * 768) / width);
      width = 768;
    } else if (height < width && height > 768) {
      width = Math.round((width * 768) / height);
      height = 768;
    }

    return await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 80,
        progressive: true
      })
      .toBuffer();
  } catch (error) {
    console.error('Image optimization failed:', error);
    return buffer; // Return original buffer if optimization fails
  }
}