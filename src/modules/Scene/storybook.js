import { illustrationTexture } from './textures';

// Flat, storybook-style illustrations for the Daydream and Kawaii scenes: soft pastel fills, no
// outlines, a light inner highlight. Each is drawn once on a canvas and used as a sprite.

const tau = Math.PI * 2;

function blob(ctx, circles, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (const [x, y, r] of circles) {
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, tau);
  }
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill, rotation = 0) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, tau);
  ctx.fill();
}

function shaded(ctx, x, y, r, light, dark) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, light);
  g.addColorStop(1, dark);
  return g;
}

// Big flat cloud, flat-bottomed like a sticker.
export const pastelCloudTexture = (key, fill) =>
  illustrationTexture(`cloud-${key}`, [512, 256], ctx => {
    blob(ctx, [[130, 170, 78], [220, 120, 104], [330, 140, 86], [410, 178, 62]], fill);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(60, 160, 400, 78, 39);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(210, 95, 70, 30, -0.2, 0, tau);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  });

export const chickTexture = () =>
  illustrationTexture('chick', [256, 256], ctx => {
    ellipse(ctx, 128, 236, 70, 10, 'rgba(180, 160, 120, 0.18)');
    ctx.fillStyle = shaded(ctx, 128, 150, 92, '#fff3c4', '#f3cf7a');
    ctx.beginPath();
    ctx.arc(128, 104, 54, Math.PI, 0);
    ctx.bezierCurveTo(196, 130, 214, 172, 196, 204);
    ctx.quadraticCurveTo(128, 236, 60, 204);
    ctx.bezierCurveTo(42, 172, 60, 130, 74, 104);
    ctx.fill();
    ellipse(ctx, 70, 160, 22, 38, '#f1c86e', 0.5);
    ellipse(ctx, 186, 160, 22, 38, '#f1c86e', -0.5);
    blob(ctx, [[104, 98, 7], [152, 98, 7]], '#5b4a52');
    blob(ctx, [[106, 95, 2.5], [154, 95, 2.5]], '#ffffff');
    ellipse(ctx, 92, 120, 12, 7, 'rgba(255, 150, 150, 0.45)');
    ellipse(ctx, 164, 120, 12, 7, 'rgba(255, 150, 150, 0.45)');
    ctx.fillStyle = '#f2a06b';
    ctx.beginPath();
    ctx.moveTo(116, 112);
    ctx.quadraticCurveTo(128, 104, 140, 112);
    ctx.quadraticCurveTo(128, 128, 116, 112);
    ctx.fill();
    ctx.fillStyle = '#f3cf7a';
    ctx.beginPath();
    ctx.moveTo(120, 52);
    ctx.quadraticCurveTo(126, 30, 140, 40);
    ctx.quadraticCurveTo(132, 44, 132, 54);
    ctx.fill();
  });

export const ladybugTexture = () =>
  illustrationTexture('ladybug', [256, 256], ctx => {
    ctx.strokeStyle = '#8f8698';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(128 + side * 14, 70);
      ctx.quadraticCurveTo(128 + side * 30, 36, 128 + side * 44, 34);
      ctx.stroke();
      for (const y of [120, 150, 178]) {
        ctx.beginPath();
        ctx.moveTo(128 + side * 60, y);
        ctx.lineTo(128 + side * 86, y + 8);
        ctx.stroke();
      }
    }
    blob(ctx, [[84, 34, 7], [172, 34, 7]], '#8f8698');
    ctx.fillStyle = shaded(ctx, 128, 150, 76, '#ffd6d6', '#f2a5a5');
    ctx.beginPath();
    ctx.arc(128, 150, 72, 0, tau);
    ctx.fill();
    ctx.fillStyle = '#8f8698';
    ctx.beginPath();
    ctx.arc(128, 86, 34, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(160, 100, 110, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(128, 90);
    ctx.lineTo(128, 220);
    ctx.stroke();
    blob(ctx, [[96, 128, 12], [160, 124, 10], [92, 178, 10], [164, 180, 13], [128, 202, 7]], 'rgba(214, 120, 128, 0.55)');
    blob(ctx, [[116, 74, 4], [140, 74, 4]], '#ffffff');
  });

export const cloverTexture = () =>
  illustrationTexture('clover', [256, 256], ctx => {
    ctx.strokeStyle = '#7fb89a';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.quadraticCurveTo(136, 190, 168, 232);
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(128, 120);
      ctx.rotate((i * tau) / 4 + Math.PI / 4);
      ctx.fillStyle = shaded(ctx, 0, -50, 46, '#c9f0d8', '#8fd0ad');
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.bezierCurveTo(-58, -40, -40, -98, 0, -70);
      ctx.bezierCurveTo(40, -98, 58, -40, 0, -6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(0, -58);
      ctx.stroke();
      ctx.restore();
    }
  });

export const butterflyTexture = (key, wing, inner) =>
  illustrationTexture(`butterfly-${key}`, [256, 256], ctx => {
    for (const side of [-1, 1]) {
      ellipse(ctx, 128 + side * 50, 96, 52, 62, wing, side * 0.5);
      ellipse(ctx, 128 + side * 42, 168, 34, 40, wing, -side * 0.4);
      ellipse(ctx, 128 + side * 50, 96, 24, 30, inner, side * 0.5);
    }
    ctx.fillStyle = '#8a7f96';
    ctx.beginPath();
    ctx.roundRect(120, 70, 16, 120, 8);
    ctx.fill();
    ctx.strokeStyle = '#8a7f96';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(128, 72);
      ctx.quadraticCurveTo(128 + side * 10, 44, 128 + side * 26, 38);
      ctx.stroke();
    }
  });

export const flowerTexture = (key, petal, centre = '#f6d27a') =>
  illustrationTexture(`flower-${key}`, [128, 128], ctx => {
    for (let i = 0; i < 5; i++) {
      const a = (i * tau) / 5 - Math.PI / 2;
      ellipse(ctx, 64 + Math.cos(a) * 30, 64 + Math.sin(a) * 30, 24, 17, petal, a);
    }
    blob(ctx, [[64, 64, 16]], centre);
    blob(ctx, [[59, 59, 5]], 'rgba(255, 255, 255, 0.6)');
  });

// A diagonal string of soft pastel beads, like a dotted rainbow.
export const beadArcTexture = () =>
  illustrationTexture('bead-arc', [512, 512], ctx => {
    const colors = ['#c9b8e8', '#f6d58a', '#b8dcc0', '#f4c2a8', '#b9d6ea'];
    for (let i = 0; i < 26; i++) {
      const t = i / 25;
      const x = 40 + t * 430;
      const y = 60 + t * 380 - Math.sin(t * Math.PI) * 70;
      ctx.globalAlpha = 0.75;
      ellipse(ctx, x, y, 24, 18, colors[i % colors.length], 0.7);
    }
    ctx.globalAlpha = 1;
  });

// --- Kawaii -------------------------------------------------------------------------------

function happyFace(ctx, x, y, size, ink = '#5a2a4a') {
  ctx.strokeStyle = ink;
  ctx.lineWidth = size * 0.07;
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(x + side * size * 0.32, y, size * 0.11, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x, y + size * 0.12, size * 0.16, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  ellipse(ctx, x - size * 0.52, y + size * 0.16, size * 0.13, size * 0.08, 'rgba(255, 120, 170, 0.55)');
  ellipse(ctx, x + size * 0.52, y + size * 0.16, size * 0.13, size * 0.08, 'rgba(255, 120, 170, 0.55)');
}

export const sunFaceTexture = () =>
  illustrationTexture('sun-face', [512, 512], ctx => {
    ctx.fillStyle = '#ffe48a';
    for (let i = 0; i < 12; i++) {
      ctx.save();
      ctx.translate(256, 256);
      ctx.rotate((i * tau) / 12);
      ctx.beginPath();
      ctx.roundRect(-22, -238, 44, 80, 22);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = shaded(ctx, 256, 256, 150, '#fff3b8', '#ffd25e');
    ctx.beginPath();
    ctx.arc(256, 256, 146, 0, tau);
    ctx.fill();
    happyFace(ctx, 256, 250, 200);
  });

export const starFaceTexture = (key, fill) =>
  illustrationTexture(`star-face-${key}`, [256, 256], ctx => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * tau) / 10 - Math.PI / 2;
      const r = i % 2 ? 50 : 112;
      ctx.lineTo(128 + Math.cos(a) * r, 136 + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 26;
    ctx.strokeStyle = fill;
    ctx.stroke();
    ctx.fill();
    happyFace(ctx, 128, 140, 90);
  });
