const MAX_CHARS = 600000; // target size of the encoded image

function draw(img, size) {
  const scale = Math.min(1, size / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // PNGs with transparency become white, not black
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function resizeImage(file, maxSize = 1200) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('This image could not be loaded'));
      img.onload = () => {
        let size = maxSize;
        let data = '';
        for (let attempt = 0; attempt < 4; attempt++) {
          const canvas = draw(img, size);
          for (const q of [0.82, 0.72, 0.62, 0.5]) {
            data = canvas.toDataURL('image/jpeg', q);
            if (data.length <= MAX_CHARS) return resolve(data);
          }
          size = Math.round(size * 0.8); // still too big, try smaller dimensions
        }
        resolve(data);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}