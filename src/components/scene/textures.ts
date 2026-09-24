// Module-level canvas draw functions. They must stay stable references so
// useCanvasTexture builds each texture once.
import { menuBoard } from "@/content/portfolio";
import { createRandom, handFont, roundedRect, scriptFont, type CanvasDraw } from "./canvas-texture";

const woodTones = ["#8a5a3b", "#7a4d31", "#94633f", "#6e4529", "#86553a"];

/** Chevron parquet: mirrored slanted planks with grain lines. Tiles seamlessly. */
export const drawChevronFloor: CanvasDraw = (ctx, w, h) => {
  const random = createRandom(7);
  const cols = 8;
  const colW = w / cols;
  const plankH = h / 16;
  const slant = colW * 0.5;
  ctx.fillStyle = "#3a2416";
  ctx.fillRect(0, 0, w, h);

  for (let c = 0; c < cols; c++) {
    const x0 = c * colW;
    const dir = c % 2 === 0 ? 1 : -1;
    for (let y = -plankH * 3; y < h + plankH * 3; y += plankH) {
      const yLeft = dir === 1 ? y : y + slant;
      const yRight = dir === 1 ? y + slant : y;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0 + 1, yLeft + 1);
      ctx.lineTo(x0 + colW - 1, yRight + 1);
      ctx.lineTo(x0 + colW - 1, yRight + plankH - 1);
      ctx.lineTo(x0 + 1, yLeft + plankH - 1);
      ctx.closePath();
      ctx.fillStyle = woodTones[Math.floor(random() * woodTones.length)];
      ctx.fill();
      ctx.clip();
      for (let g = 0; g < 7; g++) {
        const offset = random() * plankH;
        ctx.strokeStyle = `rgba(40, 22, 12, ${0.08 + random() * 0.14})`;
        ctx.lineWidth = 0.6 + random() * 1.4;
        ctx.beginPath();
        ctx.moveTo(x0, yLeft + offset);
        ctx.bezierCurveTo(x0 + colW * 0.3, yLeft + offset + (yRight - yLeft) * 0.3 + random() * 4, x0 + colW * 0.7, yLeft + offset + (yRight - yLeft) * 0.7 - random() * 4, x0 + colW, yRight + offset);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
};

/** Exposed brick with mortar and speckle noise. */
export const drawBrick: CanvasDraw = (ctx, w, h) => {
  const random = createRandom(11);
  ctx.fillStyle = "#bfae9c";
  ctx.fillRect(0, 0, w, h);
  const brickW = w / 8;
  const brickH = h / 10;
  const brickTones = ["#9c4f36", "#a85a3e", "#8e4530", "#b3664a", "#7f3f2c", "#a0543b"];
  for (let row = 0; row < 10; row++) {
    const offset = row % 2 ? brickW / 2 : 0;
    for (let col = -1; col < 9; col++) {
      const x = col * brickW + offset;
      const y = row * brickH;
      ctx.fillStyle = brickTones[Math.floor(random() * brickTones.length)];
      roundedRect(ctx, x + 4, y + 4, brickW - 8, brickH - 8, 4);
      ctx.fill();
      const shade = ctx.createLinearGradient(0, y, 0, y + brickH);
      shade.addColorStop(0, "rgba(255,255,255,0.08)");
      shade.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = shade;
      ctx.fill();
    }
  }
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = random() > 0.5 ? "rgba(0,0,0,0.12)" : "rgba(255,240,220,0.1)";
    ctx.fillRect(random() * w, random() * h, 2, 2);
  }
};

/** Glossy cream subway tiles for the back-bar splash. */
export const drawSubwayTile: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = "#cfc6b8";
  ctx.fillRect(0, 0, w, h);
  const tileW = w / 4;
  const tileH = h / 8;
  for (let row = 0; row < 8; row++) {
    const offset = row % 2 ? tileW / 2 : 0;
    for (let col = -1; col < 5; col++) {
      const x = col * tileW + offset + 3;
      const y = row * tileH + 3;
      const gradient = ctx.createLinearGradient(x, y, x, y + tileH);
      gradient.addColorStop(0, "#fbf7ef");
      gradient.addColorStop(1, "#e8e0d2");
      ctx.fillStyle = gradient;
      roundedRect(ctx, x, y, tileW - 6, tileH - 6, 8);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillRect(x + 8, y + 6, tileW * 0.4, 3);
    }
  }
};

/** White marble with soft grey veins. */
export const drawMarble: CanvasDraw = (ctx, w, h) => {
  const random = createRandom(23);
  ctx.fillStyle = "#efebe5";
  ctx.fillRect(0, 0, w, h);
  ctx.filter = "blur(1.5px)";
  for (let i = 0; i < 14; i++) {
    ctx.strokeStyle = `rgba(120, 115, 110, ${0.15 + random() * 0.3})`;
    ctx.lineWidth = 0.8 + random() * 3;
    ctx.beginPath();
    let x = random() * w;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < h) {
      const nx = x + (random() - 0.5) * 160;
      const ny = y + 40 + random() * 80;
      ctx.quadraticCurveTo(x + (random() - 0.5) * 80, (y + ny) / 2, nx, ny);
      x = nx;
      y = ny;
    }
    ctx.stroke();
  }
  ctx.filter = "none";
};

function dottedRow(ctx: CanvasRenderingContext2D, name: string, price: string, x: number, y: number, width: number) {
  ctx.textAlign = "left";
  ctx.fillText(name, x, y);
  const nameWidth = ctx.measureText(name).width;
  ctx.textAlign = "right";
  ctx.fillText(price, x + width, y);
  const priceWidth = ctx.measureText(price).width;
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.setLineDash([3, 8]);
  ctx.beginPath();
  ctx.moveTo(x + nameWidth + 10, y - 6);
  ctx.lineTo(x + width - priceWidth - 10, y - 6);
  ctx.stroke();
  ctx.restore();
}

/** Chalk menu where every drink is a tech stack. */
export const drawMenuBoard: CanvasDraw = (ctx, w, h) => {
  const random = createRandom(5);
  ctx.fillStyle = "#26302a";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) {
    const gradient = ctx.createRadialGradient(random() * w, random() * h, 0, random() * w, random() * h, 120 + random() * 160);
    gradient.addColorStop(0, "rgba(255,255,255,0.05)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.fillStyle = "#f3efe6";
  ctx.strokeStyle = "#f3efe6";
  ctx.textAlign = "center";
  ctx.font = `bold 64px ${handFont}`;
  ctx.fillText("Brew & Code", w / 2, 88);
  ctx.font = `28px ${handFont}`;
  ctx.fillStyle = "#e2c9a6";
  ctx.fillText("— menu dự án hôm nay —", w / 2, 132);

  ctx.lineWidth = 2;
  ctx.font = `bold 34px ${handFont}`;
  ctx.fillStyle = "#ffd28a";
  ctx.textAlign = "left";
  ctx.fillText("Cà phê", 70, 200);
  ctx.fillText("Đặc biệt", w / 2 + 40, 200);

  ctx.font = `28px ${handFont}`;
  ctx.fillStyle = "#f3efe6";
  ctx.strokeStyle = "#f3efe6";
  const columnWidth = w / 2 - 120;
  menuBoard.coffee.forEach(([name, price], index) => dottedRow(ctx, name, price, 70, 252 + index * 52, columnWidth));
  menuBoard.specials.forEach(([name, price], index) => dottedRow(ctx, name, price, w / 2 + 40, 252 + index * 52, columnWidth));

  // Doodle: steaming cup + beans
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#f3efe6";
  const cx = w / 2;
  const cy = h - 70;
  ctx.beginPath();
  ctx.moveTo(cx - 40, cy - 30);
  ctx.lineTo(cx - 32, cy + 20);
  ctx.quadraticCurveTo(cx, cy + 34, cx + 32, cy + 20);
  ctx.lineTo(cx + 40, cy - 30);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 50, cy - 8, 14, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  [-14, 6].forEach((dx) => {
    ctx.beginPath();
    ctx.moveTo(cx + dx, cy - 40);
    ctx.bezierCurveTo(cx + dx - 12, cy - 55, cx + dx + 12, cy - 65, cx + dx, cy - 80);
    ctx.stroke();
  });
  ctx.fillStyle = "#e2c9a6";
  ctx.font = `24px ${handFont}`;
  ctx.textAlign = "left";
  ctx.fillText("✦ chạm vào bảng để xem dự án", 70, h - 36);
};

/** Neon script on a transparent background; bright core over a soft halo. */
export const drawNeonSign: CanvasDraw = (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `italic 150px ${scriptFont}`;
  ctx.shadowColor = "#ff5e98";
  ctx.lineJoin = "round";
  for (const [blur, width, color] of [
    [40, 14, "rgba(255, 94, 152, 0.55)"],
    [18, 8, "rgba(255, 140, 180, 0.9)"],
    [4, 3, "#fff1f6"],
  ] as const) {
    ctx.shadowBlur = blur;
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.strokeText("Brew & Code", w / 2, h / 2 + 6);
  }
};

/** Dark editor with a tiny syntax-highlighted snippet. */
export const drawLaptopCode: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = "#1e1b26";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2a2635";
  ctx.fillRect(0, 0, w, 26);
  ["#ff6159", "#ffbd2e", "#28c941"].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(18 + index * 20, 13, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  const lines: [string, string][][] = [
    [["const ", "#c792ea"], ["tung", "#82aaff"], [" = ", "#eeffff"], ["new ", "#c792ea"], ["Developer", "#ffcb6b"], ["({", "#eeffff"]],
    [["  role", "#f07178"], [": ", "#eeffff"], ['"Full-Stack"', "#c3e88d"], [",", "#eeffff"]],
    [["  stack", "#f07178"], [": [", "#eeffff"], ['"Node.js"', "#c3e88d"], [", ", "#eeffff"], ['"Next.js"', "#c3e88d"], ["],", "#eeffff"]],
    [["  coffee", "#f07178"], [": ", "#eeffff"], ["Infinity", "#f78c6c"], [",", "#eeffff"]],
    [["});", "#eeffff"]],
    [["", "#eeffff"]],
    [["await ", "#c792ea"], ["tung", "#82aaff"], [".", "#eeffff"], ["brew", "#82aaff"], ["(", "#eeffff"], ["yourIdea", "#f78c6c"], [");", "#eeffff"]],
  ];
  ctx.font = "bold 19px Menlo, Consolas, monospace";
  ctx.textBaseline = "top";
  lines.forEach((tokens, row) => {
    const y = 44 + row * 30;
    ctx.fillStyle = "#5c5670";
    ctx.fillText(String(row + 1).padStart(2, " "), 12, y);
    let x = 50;
    tokens.forEach(([text, color]) => {
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    });
  });
  ctx.fillStyle = "#82aaff";
  ctx.fillRect(50, 44 + 7 * 30, 10, 22);
};

/** Top view of a latte: crema ring with a poured heart. */
export const drawLatteArt: CanvasDraw = (ctx, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, w / 2);
  gradient.addColorStop(0, "#c48a57");
  gradient.addColorStop(0.75, "#a86a3b");
  gradient.addColorStop(1, "#5a3520");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fbf1e2";
  ctx.beginPath();
  ctx.moveTo(cx, cy + w * 0.28);
  ctx.bezierCurveTo(cx - w * 0.42, cy - w * 0.02, cx - w * 0.2, cy - w * 0.34, cx, cy - w * 0.12);
  ctx.bezierCurveTo(cx + w * 0.2, cy - w * 0.34, cx + w * 0.42, cy - w * 0.02, cx, cy + w * 0.28);
  ctx.fill();
  ctx.strokeStyle = "#c48a57";
  ctx.lineWidth = w * 0.02;
  [0.05, 0.13].forEach((offset) => {
    ctx.beginPath();
    ctx.arc(cx, cy + w * offset, w * 0.1, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  });
};

/** Rainy evening street seen through the window. */
export const drawCityNight: CanvasDraw = (ctx, w, h) => {
  const random = createRandom(31);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#1d2440");
  sky.addColorStop(0.55, "#4a3f6b");
  sky.addColorStop(0.8, "#c9786a");
  sky.addColorStop(1, "#e8a77a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  for (let layer = 0; layer < 2; layer++) {
    let x = -20;
    while (x < w) {
      const bw = 60 + random() * 110;
      const bh = h * (layer === 0 ? 0.35 + random() * 0.3 : 0.2 + random() * 0.25);
      ctx.fillStyle = layer === 0 ? "#2b2a45" : "#1a1a2c";
      ctx.fillRect(x, h - bh, bw, bh);
      for (let wy = h - bh + 14; wy < h - 20; wy += 22) {
        for (let wx = x + 10; wx < x + bw - 14; wx += 18) {
          if (random() > 0.55) {
            ctx.fillStyle = random() > 0.3 ? "rgba(255, 210, 140, 0.85)" : "rgba(160, 200, 255, 0.7)";
            ctx.fillRect(wx, wy, 8, 11);
          }
        }
      }
      x += bw + 6;
    }
  }
  // Street glow
  const street = ctx.createLinearGradient(0, h * 0.9, 0, h);
  street.addColorStop(0, "rgba(255, 190, 120, 0)");
  street.addColorStop(1, "rgba(255, 190, 120, 0.5)");
  ctx.fillStyle = street;
  ctx.fillRect(0, h * 0.9, w, h * 0.1);
};

/** Transparent rain streaks; scrolled vertically for motion. */
export const drawRain: CanvasDraw = (ctx, w, h) => {
  const random = createRandom(3);
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = "round";
  for (let i = 0; i < 180; i++) {
    const x = random() * w;
    const y = random() * h;
    const length = 14 + random() * 30;
    ctx.strokeStyle = `rgba(210, 225, 255, ${0.2 + random() * 0.35})`;
    ctx.lineWidth = 1 + random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3, y + length);
    ctx.stroke();
  }
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(230, 240, 255, ${0.3 + random() * 0.4})`;
    ctx.beginPath();
    ctx.arc(random() * w, random() * h, 1.5 + random() * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
};

/** Vinyl record: grooves plus a red centre label. */
export const drawVinyl: CanvasDraw = (ctx, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  ctx.fillStyle = "#111014";
  ctx.beginPath();
  ctx.arc(cx, cy, w / 2, 0, Math.PI * 2);
  ctx.fill();
  for (let r = w * 0.2; r < w * 0.49; r += 3) {
    ctx.strokeStyle = `rgba(255,255,255,${r % 9 < 3 ? 0.08 : 0.03})`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#c2413f";
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fbe7d6";
  ctx.textAlign = "center";
  ctx.font = `bold ${w * 0.05}px Georgia, serif`;
  ctx.fillText("LO-FI", cx, cy - w * 0.05);
  ctx.font = `${w * 0.035}px Georgia, serif`;
  ctx.fillText("beats to code to", cx, cy + w * 0.08);
  ctx.fillStyle = "#111014";
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.015, 0, Math.PI * 2);
  ctx.fill();
};

/** Framed print on the brick wall. */
export const drawPoster: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = "#f3e6d2";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#c96f4a";
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.42, w * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#35574a";
  ctx.fillRect(0, h * 0.42, w, h * 0.2);
  ctx.fillStyle = "#2a1a10";
  ctx.textAlign = "center";
  ctx.font = `bold ${w * 0.11}px Georgia, serif`;
  ctx.fillText("CODE", w / 2, h * 0.74);
  ctx.font = `${w * 0.07}px Georgia, serif`;
  ctx.fillText("coffee · repeat", w / 2, h * 0.84);
};

/** Builds a kraft-paper coffee bag label. Call at module level only. */
function makeCoffeeBag(origin: string, note: string, accent: string): CanvasDraw {
  return (ctx, w, h) => {
    ctx.fillStyle = "#c9a57a";
    ctx.fillRect(0, 0, w, h);
    const random = createRandom(origin.length);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(90, 60, 30, ${random() * 0.12})`;
      ctx.fillRect(random() * w, random() * h, 2, 2);
    }
    ctx.fillStyle = accent;
    ctx.fillRect(w * 0.12, h * 0.3, w * 0.76, h * 0.45);
    ctx.fillStyle = "#fbf5ea";
    ctx.textAlign = "center";
    ctx.font = `bold ${w * 0.12}px Georgia, serif`;
    ctx.fillText("B&C", w / 2, h * 0.46);
    ctx.font = `${w * 0.075}px Georgia, serif`;
    ctx.fillText(origin, w / 2, h * 0.58);
    ctx.font = `${w * 0.06}px Georgia, serif`;
    ctx.fillText(note, w / 2, h * 0.68);
  };
}

export const coffeeBagDraws = [
  makeCoffeeBag("Đà Lạt", "Arabica", "#35574a"),
  makeCoffeeBag("Buôn Ma Thuột", "Robusta", "#8c4a2f"),
  makeCoffeeBag("Sơn La", "Catimor", "#2a1a10"),
];

/** Builds a single glyph sprite (z, ♪). Call at module level only. */
function makeGlyph(glyph: string, color: string): CanvasDraw {
  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${h * 0.8}px ${handFont}`;
    ctx.fillText(glyph, w / 2, h / 2);
  };
}

export const drawSleepyZ = makeGlyph("z", "#fbf7f0");
export const drawMusicNote = makeGlyph("♪", "#ffd28a");
export const drawHeart = makeGlyph("♥", "#ff7aa8");
export const drawSparkle = makeGlyph("✦", "#ffe2a8");

/** Teardrop of water for the watering-can pour. */
export const drawWaterDrop: CanvasDraw = (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#d8f0ff");
  gradient.addColorStop(1, "#5aa9e6");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(w / 2, h * 0.08);
  ctx.bezierCurveTo(w * 0.8, h * 0.45, w * 0.82, h * 0.9, w / 2, h * 0.92);
  ctx.bezierCurveTo(w * 0.18, h * 0.9, w * 0.2, h * 0.45, w / 2, h * 0.08);
  ctx.fill();
};

/** Hanging board over the retail shelf: script title plus the Trustinfy storefront address. */
export const drawShopSign: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = "#f6eee2";
  roundedRect(ctx, 0, 0, w, h, h * 0.12);
  ctx.fill();
  ctx.strokeStyle = "#4a2e1c";
  ctx.lineWidth = h * 0.035;
  roundedRect(ctx, h * 0.06, h * 0.06, w - h * 0.12, h - h * 0.12, h * 0.09);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#b8663f";
  ctx.font = `${h * 0.36}px ${scriptFont}`;
  ctx.fillText("Cửa hàng", w / 2, h * 0.36);
  ctx.fillStyle = "#2a1a10";
  ctx.font = `${h * 0.1}px Georgia, serif`;
  ctx.fillText("MỌI MẶT HÀNG · GIAO DỊCH AN TOÀN TẠI", w / 2, h * 0.6);
  const pillW = w * 0.46;
  ctx.fillStyle = "#2f6fed";
  roundedRect(ctx, (w - pillW) / 2, h * 0.68, pillW, h * 0.2, h * 0.1);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${h * 0.12}px system-ui, sans-serif`;
  ctx.fillText("trustinfy.com", w / 2, h * 0.785);
};

/** Storefront UI on the shop tablet: brand bar, product grid and an escrow badge. */
export const drawShopTablet: CanvasDraw = (ctx, w, h) => {
  ctx.fillStyle = "#f4f7ff";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2f6fed";
  ctx.fillRect(0, 0, w, h * 0.2);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${h * 0.11}px system-ui, sans-serif`;
  ctx.fillText("Trustinfy", w * 0.06, h * 0.1);
  const colors = ["#c9a57a", "#35574a", "#b8434f", "#e8c26a", "#8c4a2f", "#6d7f5a"];
  colors.forEach((color, index) => {
    const x = w * 0.06 + (index % 3) * w * 0.31;
    const y = h * 0.26 + Math.floor(index / 3) * h * 0.3;
    ctx.fillStyle = "#ffffff";
    roundedRect(ctx, x, y, w * 0.27, h * 0.26, 8);
    ctx.fill();
    ctx.fillStyle = color;
    roundedRect(ctx, x + 6, y + 6, w * 0.27 - 12, h * 0.14, 5);
    ctx.fill();
    ctx.fillStyle = "#c8d3ea";
    ctx.fillRect(x + 6, y + h * 0.2, w * 0.15, 5);
  });
  ctx.fillStyle = "#1f9d61";
  roundedRect(ctx, w * 0.06, h * 0.86, w * 0.88, h * 0.1, h * 0.05);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = `bold ${h * 0.065}px system-ui, sans-serif`;
  ctx.fillText("✓ Thanh toán tạm giữ an toàn", w / 2, h * 0.91);
};

/** Soft radial puff for steam sprites. */
export const drawSoftPuff: CanvasDraw = (ctx, w, h) => {
  const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
};
