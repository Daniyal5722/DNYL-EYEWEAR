// High-Fidelity Optical Virtual Try-On Compositor
// Preserves 100% of user identity while seamlessly projecting DNYL eyewear frames

import { FacialLandmarks, TryOnAdjustment } from '../types';

interface FrameCache {
  [url: string]: HTMLCanvasElement;
}

const frameCanvasCache: FrameCache = {};

/**
 * Pre-processes a studio product photo to extract a clean transparent frame
 * Removes white/light studio background with anti-aliased edge feathering
 */
export async function getCleanFrameCanvas(imageUrl: string): Promise<HTMLCanvasElement> {
  if (frameCanvasCache[imageUrl]) {
    return frameCanvasCache[imageUrl];
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(canvas);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample background color from corners
      const cornerR = (data[0] + data[(canvas.width - 1) * 4] + data[(canvas.height - 1) * canvas.width * 4]) / 3;
      const cornerG = (data[1] + data[(canvas.width - 1) * 4 + 1] + data[(canvas.height - 1) * canvas.width * 4 + 1]) / 3;
      const cornerB = (data[2] + data[(canvas.width - 1) * 4 + 2] + data[(canvas.height - 1) * canvas.width * 4 + 2]) / 3;
      const bgLum = 0.299 * cornerR + 0.587 * cornerG + 0.114 * cornerB;

      // Studio background removal with smooth edge thresholding
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Calculate distance to background color
        const diff = Math.sqrt((r - cornerR) ** 2 + (g - cornerG) ** 2 + (b - cornerB) ** 2);

        if (diff < 22 && lum > 220) {
          // Pure studio background -> fully transparent
          data[i + 3] = 0;
        } else if (diff < 45 && lum > 200) {
          // Anti-aliased edge smoothing
          const alphaFactor = (diff - 22) / (45 - 22);
          data[i + 3] = Math.floor(255 * alphaFactor);
        } else {
          // Lenses: if very dark, preserve slight translucency for realistic eyes visible underneath polarized sheen
          if (lum < 35) {
            data[i + 3] = 230; // 90% opaque dark polarized lens
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      frameCanvasCache[imageUrl] = canvas;
      resolve(canvas);
    };

    img.onerror = () => {
      const dummy = document.createElement('canvas');
      dummy.width = 100;
      dummy.height = 100;
      resolve(dummy);
    };
  });
}

/**
 * Renders the composite try-on onto a destination canvas
 */
export async function renderTryOnComposite({
  destCanvas,
  userPhotoImg,
  frameCanvas,
  landmarks,
  adjustment,
}: {
  destCanvas: HTMLCanvasElement;
  userPhotoImg: HTMLImageElement;
  frameCanvas: HTMLCanvasElement;
  landmarks: FacialLandmarks;
  adjustment: TryOnAdjustment;
}) {
  const ctx = destCanvas.getContext('2d');
  if (!ctx) return;

  const w = userPhotoImg.naturalWidth || userPhotoImg.width;
  const h = userPhotoImg.naturalHeight || userPhotoImg.height;

  if (destCanvas.width !== w || destCanvas.height !== h) {
    destCanvas.width = w;
    destCanvas.height = h;
  }

  // 1. Draw 100% authentic user photo - ZERO distortion or modification
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(userPhotoImg, 0, 0, w, h);

  // 2. Compute coordinates based on landmarks
  const eyeLeftX = (landmarks.leftEye.x / 100) * w;
  const eyeLeftY = (landmarks.leftEye.y / 100) * h;
  const eyeRightX = (landmarks.rightEye.x / 100) * w;
  const eyeRightY = (landmarks.rightEye.y / 100) * h;

  // Interpupillary distance
  const ipd = Math.hypot(eyeRightX - eyeLeftX, eyeRightY - eyeLeftY);

  // Face width estimation (fall back to 2.4x IPD if faceWidthPct is default)
  const faceWidthPx = (landmarks.faceWidthPct / 100) * w || ipd * 2.35;

  // Center position at bridge
  const bridgeX = (landmarks.noseBridge.x / 100) * w + (adjustment.xOffset * w) / 100;
  const bridgeY = (landmarks.noseBridge.y / 100) * h + (adjustment.yOffset * h) / 100;

  // Frame natural width scale: average sunglasses width is ~1.05x to 1.1x face width at eye level
  const baseFrameWidth = faceWidthPx * 1.06;
  const frameWidth = baseFrameWidth * adjustment.scale;
  const frameAspect = frameCanvas.width / frameCanvas.height;
  const frameHeight = frameWidth / frameAspect;

  // Angle computation: geometric tilt between eyes + landmark tilt + user rotation
  const eyeAngleDeg = (Math.atan2(eyeRightY - eyeLeftY, eyeRightX - eyeLeftX) * 180) / Math.PI;
  const totalAngleRad = ((eyeAngleDeg + landmarks.tiltAngleDeg + adjustment.rotation) * Math.PI) / 180;

  ctx.save();
  ctx.translate(bridgeX, bridgeY);
  ctx.rotate(totalAngleRad);

  // 3. Realistic soft contact shadow under bridge and rim onto face
  ctx.save();
  ctx.filter = 'blur(6px)';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(0, frameHeight * 0.18, frameWidth * 0.44, frameHeight * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Render the genuine DNYL sunglasses frame
  ctx.drawImage(frameCanvas, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);

  // 5. Optical polarized specular sheen across lenses
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  const sheenGrad = ctx.createLinearGradient(-frameWidth * 0.35, -frameHeight * 0.4, frameWidth * 0.35, frameHeight * 0.4);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  sheenGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0.02)');
  sheenGrad.addColorStop(0.52, 'rgba(255, 255, 255, 0.18)');
  sheenGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.0)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  // Left lens sheen
  ctx.ellipse(-frameWidth * 0.25, 0, frameWidth * 0.18, frameHeight * 0.32, -0.05, 0, Math.PI * 2);
  // Right lens sheen
  ctx.ellipse(frameWidth * 0.25, 0, frameWidth * 0.18, frameHeight * 0.32, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
