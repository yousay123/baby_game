/**
 * 精致 2D 动漫插画风立绘
 * 脸/发分层清晰，支持走路摆腿
 */
import { findMakeupOption } from "../gameplay/GameState.js";

function hexToRgb(hex) {
  const h = String(hex || "#000").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16) || 0;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function shade(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  const t = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return `rgb(${t(r)},${t(g)},${t(b)})`;
}

function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function linGrad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

function radGrad(ctx, x, y, r0, r1, stops) {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

export const ANIME_PRESETS = {
  player: {
    skin: "#FFD4BC",
    hair: "#6B4330",
    hairHl: "#A87858",
    dress: "#FF6B8A",
    dress2: "#FFE4EE",
    eye: "#7A4A2E",
    lip: "#FF7FA3",
    blush: "#FF9BB4",
    accent: "#FFC94A",
    style: "twin",
    crown: true,
  },
  mom: {
    skin: "#FFD0B4",
    hair: "#5A3A28",
    hairHl: "#8A5A40",
    dress: "#FF8FB3",
    dress2: "#E8C0F0",
    eye: "#5A3828",
    lip: "#E87898",
    blush: "#FF9AB0",
    accent: "#FFC94A",
    style: "bun",
    crown: false,
  },
  dad: {
    skin: "#E8B888",
    hair: "#2A2830",
    hairHl: "#4A4850",
    dress: "#4A7EC8",
    dress2: "#3A4558",
    eye: "#3A3028",
    lip: "#C07070",
    blush: "#E8A090",
    accent: "#7EC8FF",
    style: "short",
    crown: false,
    male: true,
  },
  cashier: {
    skin: "#FFD0B4",
    hair: "#5A3A28",
    hairHl: "#8A5A40",
    dress: "#FF9BB8",
    dress2: "#5A6578",
    eye: "#5A3828",
    lip: "#FF7FA3",
    blush: "#FF8AA8",
    accent: "#FFC94A",
    style: "pony",
    crown: false,
  },
  kidGirl: {
    skin: "#FFD4BC",
    hair: "#C87840",
    hairHl: "#E09860",
    dress: "#7EC8FF",
    dress2: "#FFE4EE",
    eye: "#5A3828",
    lip: "#FF9AB0",
    blush: "#FFB0C4",
    accent: "#FFC94A",
    style: "twin",
    crown: false,
  },
  kidBoy: {
    skin: "#F0C8A0",
    hair: "#3A3028",
    hairHl: "#5A5048",
    dress: "#6ECF7A",
    dress2: "#4A90C8",
    eye: "#3A3028",
    lip: "#C08070",
    blush: "#E8A090",
    accent: "#4A90C8",
    style: "short",
    crown: false,
    male: true,
  },
  dog: { fur: "#D4A06A", ear: "#B07840", eye: "#2A1810" },
};

function strokeFill(ctx, fill, stroke, lw = 1.5) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Draw tapered leg from hip to foot */
function drawLeg(ctx, hx, hy, fx, fy, w, fill, stroke) {
  const dx = fx - hx;
  const dy = fy - hy;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * (w * 0.5);
  const ny = (dx / len) * (w * 0.5);
  const nx2 = (-dy / len) * (w * 0.32);
  const ny2 = (dx / len) * (w * 0.32);
  ctx.beginPath();
  ctx.moveTo(hx + nx, hy + ny);
  ctx.lineTo(fx + nx2, fy + ny2);
  ctx.quadraticCurveTo(fx, fy + w * 0.15, fx - nx2, fy - ny2);
  ctx.lineTo(hx - nx, hy - ny);
  ctx.closePath();
  strokeFill(ctx, fill, stroke, 1.2);
}

export function drawAnimeCharacter(ctx, W, H, opt = {}) {
  const o = { ...ANIME_PRESETS.player, ...opt };
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const cx = W * 0.5;
  const sit = !!o.sitting;
  const s = Math.min(W / 512, H / 768);
  const walking = !!o.walking && !sit;
  const phase = walking ? o.walkPhase || 0 : 0;
  const stride = walking ? Math.sin(phase) * 26 * s : 0;
  const liftL = walking ? Math.max(0, Math.sin(phase)) * 14 * s : 0;
  const liftR = walking ? Math.max(0, -Math.sin(phase)) * 14 * s : 0;
  const armSwing = walking ? Math.sin(phase) * 20 * s : 0;

  // Ground shadow
  ctx.fillStyle = "rgba(90,50,60,0.15)";
  ctx.beginPath();
  ctx.ellipse(cx, H * (sit ? 0.9 : 0.955), W * 0.18, H * 0.016, 0, 0, Math.PI * 2);
  ctx.fill();

  if (o.kind === "dog") {
    drawDog(ctx, W, H, o, s, walking, phase);
    ctx.restore();
    return;
  }

  const skin = o.skin;
  const skinSh = shade(skin, -0.12);
  const skinLt = shade(skin, 0.1);
  const hair = o.hair;
  const hairHl = o.hairHl || shade(hair, 0.22);
  const hairDk = shade(hair, -0.18);
  const dress = o.dress;
  const dress2 = o.dress2 || shade(dress, 0.22);
  const lineSkin = shade(skin, -0.28);
  const lineHair = shade(hair, -0.32);
  const lineCloth = shade(dress, -0.3);

  const waistY = sit ? H * 0.46 : H * 0.5;
  const hipY = sit ? H * 0.55 : H * 0.6;
  const footY = sit ? H * 0.78 : H * 0.9;
  const shoulderY = waistY - 78 * s;
  const neckY = shoulderY - 4 * s;
  const headCy = neckY - 64 * s;
  const headRx = 70 * s;
  const headRy = 78 * s;

  const stock = o.male ? dress2 : "#FFD0DC";
  const hipLX = cx - 24 * s;
  const hipRX = cx + 24 * s;
  const footLX = cx - 26 * s + stride;
  const footRX = cx + 26 * s - stride;
  const footLY = footY - liftL;
  const footRY = footY - liftR;

  // —— Legs (behind skirt for dress) ——
  if (!o.male && o.skirt !== false) {
    // stockings peek under skirt — draw after skirt for sit, before for walk tips
  }

  if (o.male || o.skirt === false) {
    drawLeg(ctx, hipLX, hipY, footLX, footLY, 22 * s, linGrad(ctx, hipLX, hipY, footLX, footLY, [[0, stock], [1, shade(stock, -0.08)]]), lineCloth);
    drawLeg(ctx, hipRX, hipY, footRX, footRY, 22 * s, linGrad(ctx, hipRX, hipY, footRX, footRY, [[0, stock], [1, shade(stock, -0.08)]]), lineCloth);
    drawShoe(ctx, footLX, footLY, s, o.male ? "#2C2430" : dress, lineCloth);
    drawShoe(ctx, footRX, footRY, s, o.male ? "#2C2430" : dress, lineCloth);
  } else if (sit) {
    drawLeg(ctx, hipLX, hipY + 10 * s, hipLX - 8 * s, footLY, 18 * s, "#FFD0DC", lineSkin);
    drawLeg(ctx, hipRX, hipY + 10 * s, hipRX + 8 * s, footRY, 18 * s, "#FFD0DC", lineSkin);
    drawShoe(ctx, hipLX - 8 * s, footLY, s, dress, lineCloth);
    drawShoe(ctx, hipRX + 8 * s, footRY, s, dress, lineCloth);
  } else {
    // walk: legs visible under / at hem
    drawLeg(ctx, hipLX, hipY, footLX, footLY, 18 * s, "#FFD0DC", lineSkin);
    drawLeg(ctx, hipRX, hipY, footRX, footRY, 18 * s, "#FFD0DC", lineSkin);
    drawShoe(ctx, footLX, footLY, s, dress, lineCloth);
    drawShoe(ctx, footRX, footRY, s, dress, lineCloth);
  }

  // —— Lower body ——
  if (o.male) {
    roundRect(ctx, cx - 56 * s, waistY - 6 * s, 112 * s, 95 * s, 20 * s);
    strokeFill(ctx, linGrad(ctx, cx, waistY, cx, hipY + 40 * s, [[0, dress], [1, shade(dress, -0.1)]]), lineCloth, 1.4 * s);
  } else if (o.skirt === false) {
    drawLeg(ctx, cx - 28 * s, waistY, footLX, Math.min(footLY, hipY + 80 * s), 28 * s, dress2, lineCloth);
    drawLeg(ctx, cx + 28 * s, waistY, footRX, Math.min(footRY, hipY + 80 * s), 28 * s, dress2, lineCloth);
    roundRect(ctx, cx - 52 * s, waistY - 50 * s, 104 * s, 68 * s, 24 * s);
    strokeFill(ctx, linGrad(ctx, cx, waistY - 50 * s, cx, waistY + 18 * s, [[0, dress2], [1, dress]]), lineCloth, 1.4 * s);
  } else {
    const skirtBottom = sit ? H * 0.7 : H * 0.78;
    const sway = walking ? Math.sin(phase) * 8 * s : 0;
    ctx.beginPath();
    ctx.moveTo(cx - 36 * s, waistY);
    ctx.bezierCurveTo(cx - 120 * s + sway, waistY + 28 * s, cx - 118 * s + sway, skirtBottom - 18 * s, cx - 100 * s + sway, skirtBottom);
    ctx.quadraticCurveTo(cx, skirtBottom + 20 * s, cx + 100 * s - sway, skirtBottom);
    ctx.bezierCurveTo(cx + 118 * s - sway, skirtBottom - 18 * s, cx + 120 * s - sway, waistY + 28 * s, cx + 36 * s, waistY);
    ctx.closePath();
    strokeFill(
      ctx,
      linGrad(ctx, cx, waistY, cx, skirtBottom, [[0, shade(dress, 0.1)], [0.5, dress], [1, shade(dress, -0.16)]]),
      lineCloth,
      1.5 * s
    );
    ctx.fillStyle = "rgba(255,255,255,0.26)";
    ctx.beginPath();
    ctx.moveTo(cx - 24 * s, waistY + 14 * s);
    ctx.quadraticCurveTo(cx - 36 * s, skirtBottom - 40 * s, cx - 48 * s, skirtBottom - 6 * s);
    ctx.quadraticCurveTo(cx - 8 * s, skirtBottom - 36 * s, cx + 6 * s, waistY + 26 * s);
    ctx.closePath();
    ctx.fill();
    // bodice
    ctx.beginPath();
    ctx.moveTo(cx - 42 * s, waistY);
    ctx.quadraticCurveTo(cx - 50 * s, waistY - 52 * s, cx - 28 * s, waistY - 80 * s);
    ctx.quadraticCurveTo(cx, waistY - 70 * s, cx + 28 * s, waistY - 80 * s);
    ctx.quadraticCurveTo(cx + 50 * s, waistY - 52 * s, cx + 42 * s, waistY);
    ctx.closePath();
    strokeFill(
      ctx,
      linGrad(ctx, cx, waistY - 80 * s, cx, waistY, [[0, dress2], [1, dress]]),
      lineCloth,
      1.4 * s
    );
    ctx.beginPath();
    ctx.arc(cx, waistY - 2 * s, 8 * s, 0, Math.PI * 2);
    strokeFill(ctx, o.accent, shade(o.accent, -0.25), 1.1 * s);
  }

  // —— Arms ——
  const handLY = shoulderY + 108 * s + (walking ? -armSwing * 0.3 : 0);
  const handRY = shoulderY + 108 * s + (walking ? armSwing * 0.3 : 0);
  const handLX = cx - 66 * s + (o.male ? 4 * s : 0) - armSwing * 0.15;
  const handRX = cx + 66 * s - (o.male ? 4 * s : 0) + armSwing * 0.15;

  if (o.male) {
    drawLeg(ctx, cx - 58 * s, shoulderY, handLX, handLY, 18 * s, skin, lineSkin);
    drawLeg(ctx, cx + 58 * s, shoulderY, handRX, handRY, 18 * s, skin, lineSkin);
  } else {
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.ellipse(cx + dir * 56 * s, shoulderY + 8 * s, 24 * s, 18 * s, 0, 0, Math.PI * 2);
      strokeFill(ctx, radGrad(ctx, cx + dir * 48 * s, shoulderY, 3 * s, 26 * s, [[0, shade(dress, 0.12)], [1, dress]]), lineCloth, 1.2 * s);
    });
    drawLeg(ctx, cx - 60 * s, shoulderY + 16 * s, handLX, handLY, 16 * s, skin, lineSkin);
    drawLeg(ctx, cx + 60 * s, shoulderY + 16 * s, handRX, handRY, 16 * s, skin, lineSkin);
  }
  drawHand(ctx, handLX, handLY, 12 * s, skin, lineSkin);
  drawHand(ctx, handRX, handRY, 12 * s, skin, lineSkin);

  // —— Neck ——
  roundRect(ctx, cx - 18 * s, neckY - 16 * s, 36 * s, 40 * s, 12 * s);
  strokeFill(ctx, linGrad(ctx, cx, neckY - 16 * s, cx, neckY + 24 * s, [[0, skinLt], [1, skin]]), lineSkin, 1.1 * s);

  // —— Hair BACK (sides + top only — hole cut for face so no double-face) ——
  drawHairBackOnly(ctx, cx, headCy, headRx, headRy, hair, hairHl, hairDk, lineHair, o.style, s);

  // —— Ears ——
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.ellipse(cx + dir * (headRx - 4 * s), headCy + 8 * s, 12 * s, 17 * s, dir * 0.12, 0, Math.PI * 2);
    strokeFill(ctx, skin, lineSkin, 1.1 * s);
  });

  // —— Face plate (opaque, seals layers) ——
  ctx.beginPath();
  ctx.ellipse(cx, headCy, headRx, headRy, 0, 0, Math.PI * 2);
  ctx.fillStyle = radGrad(ctx, cx - 12 * s, headCy - 16 * s, 6 * s, headRx * 1.1, [
    [0, skinLt],
    [0.55, skin],
    [1, skinSh],
  ]);
  ctx.fill();
  ctx.strokeStyle = lineSkin;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();

  drawFaceFeatures(ctx, cx, headCy, s, o, lineHair);

  // —— Hair FRONT (bangs above eyes only) ——
  drawHairFrontOnly(ctx, cx, headCy, headRx, headRy, hair, hairHl, hairDk, lineHair, s);

  drawAccessories(ctx, cx, headCy, headRx, headRy, neckY, s, o, dress);

  ctx.restore();
}

function drawShoe(ctx, x, y, s, color, line) {
  ctx.beginPath();
  ctx.ellipse(x, y, 28 * s, 12 * s, 0, 0, Math.PI * 2);
  strokeFill(ctx, linGrad(ctx, x, y - 8 * s, x, y + 6 * s, [[0, shade(color, 0.1)], [1, shade(color, -0.08)]]), line, 1.1 * s);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(x - 6 * s, y - 3 * s, 10 * s, 3.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawHand(ctx, x, y, r, skin, line) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  strokeFill(ctx, skin, line, 1.1);
}

/** Hair behind head — evenodd cutout so face center stays empty */
function drawHairBackOnly(ctx, cx, cy, rx, ry, hair, hl, dk, line, style, s) {
  const fill = radGrad(ctx, cx - 16 * s, cy - 28 * s, 8 * s, rx * 1.35, [
    [0, hl],
    [0.4, hair],
    [1, dk],
  ]);

  // Back mass with face hole
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4 * s, rx * 1.18, ry * 1.18, 0, 0, Math.PI * 2);
  ctx.ellipse(cx, cy, rx * 0.96, ry * 0.98, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill("evenodd");

  // Soft outline on outer only
  ctx.beginPath();
  ctx.ellipse(cx, cy + 4 * s, rx * 1.18, ry * 1.18, 0, 0, Math.PI * 2);
  ctx.strokeStyle = line;
  ctx.lineWidth = 1.6 * s;
  ctx.stroke();

  if (style === "twin" || style === "pony") {
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(cx + dir * rx * 0.65, cy + ry * 0.15);
      ctx.bezierCurveTo(
        cx + dir * rx * 1.5,
        cy + ry * 0.55,
        cx + dir * rx * 1.4,
        cy + ry * 1.55,
        cx + dir * rx * 1.1,
        cy + ry * 2.3
      );
      ctx.quadraticCurveTo(cx + dir * rx * 0.7, cy + ry * 1.55, cx + dir * rx * 0.5, cy + ry * 0.55);
      ctx.closePath();
      strokeFill(
        ctx,
        linGrad(ctx, cx + dir * rx, cy, cx + dir * rx * 1.15, cy + ry * 2.2, [[0, hl], [0.4, hair], [1, dk]]),
        line,
        1.3 * s
      );
      ctx.beginPath();
      ctx.arc(cx + dir * rx * 1.12, cy + ry * 2.22, 22 * s, 0, Math.PI * 2);
      strokeFill(ctx, radGrad(ctx, cx + dir * rx * 1.08, cy + ry * 2.1, 3 * s, 22 * s, [[0, hl], [1, hair]]), line, 1.1 * s);
      if (style === "twin") {
        ctx.beginPath();
        ctx.arc(cx + dir * rx * 0.88, cy + 10 * s, 11 * s, 0, Math.PI * 2);
        strokeFill(ctx, "#FF6B8A", shade("#FF6B8A", -0.2), 1.1 * s);
      }
    });
  } else if (style === "bun") {
    ctx.beginPath();
    ctx.arc(cx, cy - ry * 0.92, 28 * s, 0, Math.PI * 2);
    strokeFill(ctx, radGrad(ctx, cx - 6 * s, cy - ry, 3 * s, 28 * s, [[0, hl], [1, hair]]), line, 1.2 * s);
  }
}

function drawHairFrontOnly(ctx, cx, cy, rx, ry, hair, hl, dk, line, s) {
  // Bangs — keep above eye line (eyes ~ cy+4)
  const bangBottom = cy - ry * 0.12;
  ctx.beginPath();
  ctx.moveTo(cx - rx * 0.92, cy - ry * 0.25);
  ctx.quadraticCurveTo(cx - rx * 0.85, cy - ry * 1.08, cx, cy - ry * 1.18);
  ctx.quadraticCurveTo(cx + rx * 0.85, cy - ry * 1.08, cx + rx * 0.92, cy - ry * 0.25);
  // scalloped underside
  ctx.quadraticCurveTo(cx + rx * 0.55, bangBottom - 8 * s, cx + rx * 0.32, bangBottom);
  ctx.quadraticCurveTo(cx + rx * 0.12, cy - ry * 0.42, cx, bangBottom + 4 * s);
  ctx.quadraticCurveTo(cx - rx * 0.12, cy - ry * 0.42, cx - rx * 0.32, bangBottom);
  ctx.quadraticCurveTo(cx - rx * 0.55, bangBottom - 8 * s, cx - rx * 0.92, cy - ry * 0.25);
  ctx.closePath();
  strokeFill(
    ctx,
    linGrad(ctx, cx, cy - ry * 1.15, cx, bangBottom, [[0, hl], [0.45, hair], [1, dk]]),
    line,
    1.4 * s
  );

  // Side locks (beside cheeks, not over face center)
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.moveTo(cx + dir * rx * 0.78, cy - ry * 0.15);
    ctx.quadraticCurveTo(cx + dir * rx * 1.12, cy + ry * 0.25, cx + dir * rx * 0.92, cy + ry * 0.75);
    ctx.quadraticCurveTo(cx + dir * rx * 0.72, cy + ry * 0.35, cx + dir * rx * 0.7, cy + ry * 0.05);
    ctx.closePath();
    strokeFill(ctx, linGrad(ctx, cx + dir * rx, cy - ry * 0.1, cx + dir * rx, cy + ry * 0.7, [[0, hl], [1, hair]]), line, 1.1 * s);
  });

  // Shine
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 18 * s, cy - ry * 0.78);
  ctx.quadraticCurveTo(cx - 4 * s, cy - ry * 0.98, cx + 12 * s, cy - ry * 0.72);
  ctx.stroke();
}

function drawFaceFeatures(ctx, cx, cy, s, o, lineHair) {
  const eyeY = cy + 6 * s;
  const eyeDx = 25 * s;

  if (o.eyeshadow) {
    ctx.fillStyle = rgba(o.eyeshadow, 0.36);
    ctx.beginPath();
    ctx.ellipse(cx - eyeDx, eyeY - 7 * s, 24 * s, 11 * s, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeDx, eyeY - 7 * s, 24 * s, 11 * s, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = lineHair;
  ctx.lineWidth = 3.4 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - eyeDx - 16 * s, eyeY - 24 * s);
  ctx.quadraticCurveTo(cx - eyeDx, eyeY - 34 * s, cx - eyeDx + 15 * s, eyeY - 22 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + eyeDx - 15 * s, eyeY - 22 * s);
  ctx.quadraticCurveTo(cx + eyeDx, eyeY - 34 * s, cx + eyeDx + 16 * s, eyeY - 24 * s);
  ctx.stroke();

  [-1, 1].forEach((dir) => {
    const ex = cx + dir * eyeDx;
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 19 * s, 22 * s, dir * 0.03, 0, Math.PI * 2);
    strokeFill(ctx, "#FFFBFA", "#E8D8D0", 1.1 * s);

    const iris = o.eye || "#6B3F2A";
    ctx.beginPath();
    ctx.ellipse(ex + dir * s, eyeY + 2 * s, 12 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = radGrad(ctx, ex, eyeY - 2 * s, 2 * s, 14 * s, [
      [0, shade(iris, 0.32)],
      [0.5, iris],
      [1, shade(iris, -0.22)],
    ]);
    ctx.fill();

    ctx.fillStyle = "#1A1008";
    ctx.beginPath();
    ctx.arc(ex + dir * s, eyeY + 2 * s, 5.8 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(ex + dir * 5 * s, eyeY - 5 * s, 5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex - dir * 4 * s, eyeY + 7 * s, 2.2 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#2A1820";
    ctx.lineWidth = 2.6 * s;
    ctx.beginPath();
    ctx.moveTo(ex - 15 * s, eyeY - 11 * s);
    ctx.quadraticCurveTo(ex, eyeY - 20 * s, ex + 15 * s, eyeY - 9 * s);
    ctx.stroke();
  });

  ctx.fillStyle = rgba("#E8A090", 0.5);
  ctx.beginPath();
  ctx.ellipse(cx, cy + 24 * s, 4 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = rgba(o.blush || "#FF9BB4", 0.4);
  ctx.beginPath();
  ctx.ellipse(cx - 40 * s, cy + 28 * s, 17 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 40 * s, cy + 28 * s, 17 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  const lip = o.lip || "#FF7FA3";
  ctx.beginPath();
  ctx.moveTo(cx - 16 * s, cy + 42 * s);
  ctx.quadraticCurveTo(cx, cy + 32 * s, cx + 16 * s, cy + 42 * s);
  ctx.quadraticCurveTo(cx, cy + 54 * s, cx - 16 * s, cy + 42 * s);
  ctx.closePath();
  strokeFill(ctx, linGrad(ctx, cx, cy + 34 * s, cx, cy + 52 * s, [[0, shade(lip, 0.1)], [1, shade(lip, -0.08)]]), shade(lip, -0.22), 1 * s);
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 43 * s, 8 * s, 2.8 * s, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(cx - 3 * s, cy + 40 * s, 5 * s, 1.8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawAccessories(ctx, cx, cy, rx, ry, neckY, s, o, dress) {
  if (o.crown) {
    const top = cy - ry + 4 * s;
    ctx.beginPath();
    ctx.moveTo(cx - 32 * s, top + 10 * s);
    ctx.lineTo(cx - 22 * s, top - 16 * s);
    ctx.lineTo(cx - 10 * s, top + 4 * s);
    ctx.lineTo(cx, top - 22 * s);
    ctx.lineTo(cx + 10 * s, top + 4 * s);
    ctx.lineTo(cx + 22 * s, top - 16 * s);
    ctx.lineTo(cx + 32 * s, top + 10 * s);
    ctx.closePath();
    strokeFill(ctx, linGrad(ctx, cx, top - 22 * s, cx, top + 10 * s, [[0, "#FFE9A0"], [1, o.accent || "#FFC94A"]]), shade(o.accent || "#FFC94A", -0.28), 1.2 * s);
    ["#FF6B8A", "#7EC8FF", "#FF9EC0"].forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(cx + (i - 1) * 16 * s, top - (i === 1 ? 12 : 2) * s, 5 * s, 0, Math.PI * 2);
      strokeFill(ctx, c, shade(c, -0.2), 0.9 * s);
    });
  }
  if (o.beret) {
    const bc = o.beretColor || "#ef6b8a";
    ctx.beginPath();
    ctx.ellipse(cx + 8 * s, cy - ry + 6 * s, 48 * s, 16 * s, 0.1, 0, Math.PI * 2);
    strokeFill(ctx, bc, shade(bc, -0.25), 1.1 * s);
  }
  if (o.catEar) {
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(cx + dir * 16 * s, cy - ry + 26 * s);
      ctx.lineTo(cx + dir * 30 * s, cy - ry - 8 * s);
      ctx.lineTo(cx + dir * 42 * s, cy - ry + 28 * s);
      ctx.closePath();
      strokeFill(ctx, "#FFB6C1", "#E89AA8", 1.1 * s);
    });
  }
  if (o.flower) {
    const fx = cx + rx * 0.52;
    const fy = cy - 6 * s;
    ["#FF6B8A", "#FF9EC0", "#FFE0EC"].forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(fx + Math.cos(i * 2.1) * 10 * s, fy + Math.sin(i * 2.1) * 8 * s, 9 * s, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(fx, fy, 5 * s, 0, Math.PI * 2);
    strokeFill(ctx, o.accent || "#FFC94A", shade(o.accent || "#FFC94A", -0.2), 1 * s);
  }
  if (o.star) {
    ctx.fillStyle = o.accent || "#FFC94A";
    ctx.beginPath();
    ctx.arc(cx - rx * 0.52, cy - 4 * s, 7 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  if (o.butterfly) {
    ctx.fillStyle = "rgba(167,139,250,0.9)";
    ctx.beginPath();
    ctx.ellipse(cx + rx * 0.48, cy - 2 * s, 14 * s, 10 * s, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + rx * 0.7, cy - 2 * s, 14 * s, 10 * s, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Earrings — separate paths (no cross-face stroke)
  if (o.earrings) {
    [-1, 1].forEach((dir) => {
      const ex = cx + dir * (rx - 4 * s);
      const ey = cy + 28 * s;
      ctx.beginPath();
      ctx.arc(ex, ey, 6 * s, 0, Math.PI * 2);
      strokeFill(ctx, "#FFF8F0", o.accent || "#FFC94A", 1.4 * s);
      ctx.beginPath();
      ctx.moveTo(ex, ey + 6 * s);
      ctx.lineTo(ex, ey + 12 * s);
      ctx.strokeStyle = o.accent || "#FFC94A";
      ctx.lineWidth = 1.4 * s;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ex, ey + 16 * s, 3.5 * s, 0, Math.PI * 2);
      strokeFill(ctx, "#FFF8F0", o.accent || "#FFC94A", 1.1 * s);
    });
  }
  if (o.necklace) {
    ctx.beginPath();
    ctx.moveTo(cx - 22 * s, neckY + 6 * s);
    ctx.quadraticCurveTo(cx, neckY + 24 * s, cx + 22 * s, neckY + 6 * s);
    ctx.strokeStyle = o.accent || "#FFC94A";
    ctx.lineWidth = 2.4 * s;
    ctx.lineCap = "round";
    ctx.stroke();
    [-7, 7, 0].forEach((dx, i) => {
      ctx.beginPath();
      ctx.arc(cx + dx * s, neckY + (i === 2 ? 24 : 18) * s, 5 * s, 0, Math.PI * 2);
      strokeFill(ctx, dress, shade(dress, -0.2), 1 * s);
    });
  }
  if (o.glasses) {
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.ellipse(cx + dir * 22 * s, cy + 4 * s, 20 * s, 16 * s, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "#3a3040";
      ctx.lineWidth = 2.4 * s;
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(cx - 2 * s, cy + 4 * s);
    ctx.lineTo(cx + 2 * s, cy + 4 * s);
    ctx.strokeStyle = "#3a3040";
    ctx.lineWidth = 2.2 * s;
    ctx.stroke();
  }
}

function drawDog(ctx, W, H, o, s, walking, phase) {
  const cx = W * 0.5;
  const cy = H * 0.55;
  const fur = o.fur || "#D4A06A";
  const ear = o.ear || "#B07840";
  const bob = walking ? Math.sin(phase) * 6 * s : 0;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 20 * s + bob, 88 * s, 52 * s, 0, 0, Math.PI * 2);
  strokeFill(ctx, radGrad(ctx, cx - 20 * s, cy, 8 * s, 88 * s, [[0, shade(fur, 0.12)], [1, fur]]), shade(fur, -0.22), 1.4 * s);
  ctx.beginPath();
  ctx.ellipse(cx + 68 * s, cy - 18 * s + bob, 46 * s, 42 * s, 0.1, 0, Math.PI * 2);
  strokeFill(ctx, fur, shade(fur, -0.22), 1.3 * s);
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.ellipse(cx + 52 * s + dir * 16 * s, cy - 48 * s + bob, 15 * s, 24 * s, dir * 0.35, 0, Math.PI * 2);
    strokeFill(ctx, ear, shade(ear, -0.2), 1.1 * s);
  });
  ctx.fillStyle = "#2A1810";
  ctx.beginPath();
  ctx.arc(cx + 60 * s, cy - 20 * s + bob, 5.5 * s, 0, Math.PI * 2);
  ctx.arc(cx + 80 * s, cy - 20 * s + bob, 5.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(cx + 62 * s, cy - 22 * s + bob, 2 * s, 0, Math.PI * 2);
  ctx.arc(cx + 82 * s, cy - 22 * s + bob, 2 * s, 0, Math.PI * 2);
  ctx.fill();
  const pawLift = walking ? Math.sin(phase) * 10 * s : 0;
  [[-48, 55 - Math.max(0, pawLift)], [-12, 58 - Math.max(0, -pawLift)], [22, 55 - Math.max(0, pawLift)], [52, 48 - Math.max(0, -pawLift)]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.ellipse(cx + x * s, cy + y * s, 17 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = shade(fur, -0.08);
    ctx.fill();
  });
}

export function makeupToAnimeOpt(state, extra = {}) {
  const lip = findMakeupOption("lipstick", state.makeup.lipstick);
  const blush = findMakeupOption("blush", state.makeup.blush);
  const eye = findMakeupOption("eyeshadow", state.makeup.eyeshadow);
  const hairOpt = findMakeupOption("hair", state.makeup.hair);
  const top = findMakeupOption("top", state.makeup.top);
  const bottom = findMakeupOption("bottom", state.makeup.bottom);
  const hat = findMakeupOption("hat", state.makeup.hat || "hat0");
  const jew = findMakeupOption("jewelry", state.makeup.jewelry || "jew0");
  const baby = findMakeupOption("baby", state.makeup.baby || "baby0");
  const propOpt = findMakeupOption("prop", state.makeup.prop || "prop0");
  // 旧存档回退：仅有 accessory 时
  const acc = findMakeupOption("accessory", state.makeup.accessory || "acc4");
  const useLegacy = !state.makeup.hat && !state.makeup.jewelry;

  const hc = hairOpt.color;
  return {
    ...ANIME_PRESETS.player,
    hair: hc,
    hairHl: shade(hc, 0.24),
    dress: bottom.skirt ? bottom.color : top.color,
    dress2: top.color,
    skirt: !!bottom.skirt,
    lip: lip.color,
    blush: blush.color,
    eyeshadow: eye.color,
    crown: useLegacy ? !!acc.crown : hat.kind === "crown",
    earrings: useLegacy ? !!acc.earrings : !!jew.earrings,
    necklace: useLegacy ? !!acc.necklace : !!jew.necklace,
    glasses: useLegacy ? !!acc.glasses : !!jew.glasses,
    flower: useLegacy ? !!acc.flower : hat.kind === "flower",
    beret: useLegacy ? !!acc.beret : hat.kind === "beret",
    beretColor: useLegacy ? acc.color : hat.color,
    star: useLegacy ? !!acc.star : hat.kind === "star",
    butterfly: useLegacy ? !!acc.butterfly : hat.kind === "butterfly",
    catEar: useLegacy ? !!acc.catEar : hat.kind === "catEar",
    cap: hat.kind === "cap",
    capColor: hat.color,
    watch: !!jew.watch,
    watchColor: jew.color || "#ff6b8a",
    bracelet: !!jew.bracelet,
    braceletColor: jew.color || "#FFC94A",
    babyKind: baby.kind || "none",
    babyColor: baby.color,
    babyWrap: baby.wrap,
    prop: propOpt.prop || "none",
    propSlot: propOpt.slot || "hand",
    propColor: propOpt.color,
    bg: state.makeup.bg || "bgRose",
    style: "twin",
    ...extra,
  };
}

export function createAnimeCanvas(w = 640, h = 960) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

export function paintAnimeCanvas(canvas, opt) {
  const ctx = canvas.getContext("2d");
  drawAnimeCharacter(ctx, canvas.width, canvas.height, opt);
  return canvas;
}

/** 仅画脸（用于立体头正面贴图） */
export function paintAnimeFace(canvas, opt = {}) {
  return paintToonFace(canvas, opt);
}

/**
 * 卡通圆脸 — 匹配胶囊体角色，不突兀
 * 大圆眼、圆腮红、简洁五官（接近最早 2D）
 */
export function paintToonFace(canvas, opt = {}) {
  const o = { ...ANIME_PRESETS.player, ...opt };
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const skin = o.skin || "#FFD4BC";
  const g = ctx.createRadialGradient(W * 0.42, H * 0.38, 8, W * 0.5, H * 0.5, W * 0.55);
  g.addColorStop(0, shade(skin, 0.08));
  g.addColorStop(0.65, skin);
  g.addColorStop(1, shade(skin, -0.1));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.5;
  const cy = H * 0.48;
  const eyeY = cy - H * 0.02;
  const eyeDx = W * 0.16;
  const eyeR = W * 0.11;

  // Eyeshadow soft
  if (o.eyeshadow) {
    ctx.fillStyle = rgba(o.eyeshadow, 0.4);
    ctx.beginPath();
    ctx.ellipse(cx - eyeDx, eyeY - eyeR * 0.35, eyeR * 1.15, eyeR * 0.45, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeDx, eyeY - eyeR * 0.35, eyeR * 1.15, eyeR * 0.45, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Brows
  ctx.strokeStyle = shade(o.hair || "#6B4330", -0.2);
  ctx.lineWidth = W * 0.022;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - eyeDx - eyeR * 0.7, eyeY - eyeR * 1.15);
  ctx.quadraticCurveTo(cx - eyeDx, eyeY - eyeR * 1.45, cx - eyeDx + eyeR * 0.65, eyeY - eyeR * 1.05);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + eyeDx - eyeR * 0.65, eyeY - eyeR * 1.05);
  ctx.quadraticCurveTo(cx + eyeDx, eyeY - eyeR * 1.45, cx + eyeDx + eyeR * 0.7, eyeY - eyeR * 1.15);
  ctx.stroke();

  // Eyes — big round (2D style)
  [-1, 1].forEach((dir) => {
    const ex = cx + dir * eyeDx;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#3A2820";
    ctx.lineWidth = W * 0.012;
    ctx.stroke();

    const iris = o.eye || "#6B3F2A";
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.arc(ex + dir * eyeR * 0.05, eyeY + eyeR * 0.08, eyeR * 0.62, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1A1008";
    ctx.beginPath();
    ctx.arc(ex + dir * eyeR * 0.05, eyeY + eyeR * 0.08, eyeR * 0.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(ex + dir * eyeR * 0.28, eyeY - eyeR * 0.28, eyeR * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex - dir * eyeR * 0.22, eyeY + eyeR * 0.32, eyeR * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Lashes
    ctx.strokeStyle = "#2C2430";
    ctx.lineWidth = W * 0.016;
    ctx.beginPath();
    ctx.moveTo(ex - eyeR * 0.75, eyeY - eyeR * 0.55);
    ctx.quadraticCurveTo(ex, eyeY - eyeR * 1.05, ex + eyeR * 0.75, eyeY - eyeR * 0.5);
    ctx.stroke();
  });

  // Nose
  ctx.fillStyle = "rgba(240,160,140,0.55)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + H * 0.06, W * 0.02, H * 0.015, 0, 0, Math.PI * 2);
  ctx.fill();

  // Blush circles
  ctx.fillStyle = rgba(o.blush || "#FF8AA8", 0.5);
  ctx.beginPath();
  ctx.arc(cx - W * 0.28, cy + H * 0.08, W * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + W * 0.28, cy + H * 0.08, W * 0.09, 0, Math.PI * 2);
  ctx.fill();

  // Lips
  const lip = o.lip || "#FF7FA3";
  ctx.fillStyle = lip;
  ctx.beginPath();
  ctx.ellipse(cx, cy + H * 0.2, W * 0.09, H * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + H * 0.185, W * 0.045, H * 0.012, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  return canvas;
}
