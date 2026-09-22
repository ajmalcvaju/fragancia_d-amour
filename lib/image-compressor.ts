export async function compressImageToMax250KB(
  file: File,
  maxSizeBytes: number = 250 * 1024
): Promise<File> {
  // If file is non-image or already <= 250 KB, return as is
  if (!file.type.startsWith("image/") || file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve) => {
    // 3-second safety fallback timeout
    const timer = setTimeout(() => {
      resolve(file);
    }, 3000);

    const safeResolve = (result: File) => {
      clearTimeout(timer);
      resolve(result);
    };

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Downscale oversized images to max 1600px for crisp display
        const MAX_DIMENSION = 1600;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          safeResolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.88;

        const attemptCompression = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                safeResolve(file);
                return;
              }

              // If small enough or minimum quality reached
              if (blob.size <= maxSizeBytes || q <= 0.2) {
                const newFilename = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                const compressedFile = new File([blob], newFilename, {
                  type: "image/webp",
                  lastModified: Date.now(),
                });
                safeResolve(compressedFile);
              } else {
                // Iteratively reduce quality to achieve <= 250 KB
                attemptCompression(Math.max(0.15, q - 0.1));
              }
            },
            "image/webp",
            q
          );
        };

        attemptCompression(quality);
      };

      img.onerror = () => safeResolve(file);
    };

    reader.onerror = () => safeResolve(file);
    reader.readAsDataURL(file);
  });
}
