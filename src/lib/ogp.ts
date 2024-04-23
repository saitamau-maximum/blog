import fs from 'fs';
import path from 'path';

import { Image, createCanvas, loadImage } from 'canvas';

import { OGP, URL } from '@/constants/url';

const AUTHOR_IMAGE_SIZE = 80;
const AUTHOR_IMAGE_GAP = 32;
const OGP_WIDTH = 1200;
const OGP_HEIGHT = 630;
const AUTHOR_LIST_MARGIN = 48;

const FONT_SIZE = 80;
const MAX_TITLE_WIDTH = OGP_WIDTH - FONT_SIZE * 2;

export const createOgp = async (
  title: string,
  authors: string[],
  slug: string[],
) => {
  console.log(`${title}のOGP画像を生成します`);
  const canvas = createCanvas(OGP_WIDTH, OGP_HEIGHT);
  const ctx = canvas.getContext('2d');
  const baseImage = await loadImage(
    path.join(OGP.PUBLIC_DIR_PATH, OGP.OGP_BASE_IMAGE_PATH),
  );
  ctx.drawImage(baseImage, 0, 0, OGP_WIDTH, OGP_HEIGHT);
  ctx.font = `bold ${FONT_SIZE}px "Noto Sans JP"`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 4;

  const titleWidth = ctx.measureText(title).width;
  if (titleWidth > MAX_TITLE_WIDTH) {
    const titleArray = title.split('');
    const TITLE_HEIGHT = FONT_SIZE * Math.ceil(titleWidth / MAX_TITLE_WIDTH);
    let titleLine = '';
    let titleLines = [];
    titleArray.forEach((char) => {
      if (ctx.measureText(titleLine + char).width > MAX_TITLE_WIDTH) {
        titleLines.push(titleLine);
        titleLine = '';
      }
      titleLine += char;
    });
    titleLines.push(titleLine);
    titleLines.forEach((line, index) => {
      ctx.fillText(
        line,
        OGP_WIDTH / 2,
        OGP_HEIGHT / 2 - TITLE_HEIGHT / 2 + FONT_SIZE * 1.5 * index,
      );
    });
  } else {
    ctx.fillText(title, OGP_WIDTH / 2, OGP_HEIGHT / 2);
  }

  const authorImages = await createAuthorImage(authors);
  const AUTHOR_LIST_WIDTH =
    AUTHOR_IMAGE_SIZE * authors.length +
    AUTHOR_IMAGE_GAP * (authors.length - 1);
  authorImages.sort().forEach((authorImage, index) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      OGP_WIDTH -
        AUTHOR_LIST_WIDTH / 2 -
        AUTHOR_LIST_MARGIN -
        (AUTHOR_IMAGE_SIZE * authors.length +
          AUTHOR_IMAGE_GAP * (authors.length - 1)) /
          2 +
        (AUTHOR_IMAGE_SIZE + AUTHOR_IMAGE_GAP) * index +
        AUTHOR_IMAGE_SIZE / 2,
      OGP_HEIGHT - AUTHOR_IMAGE_SIZE / 2 - AUTHOR_LIST_MARGIN,
      AUTHOR_IMAGE_SIZE / 2,
      0,
      Math.PI * 2,
      false,
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      authorImage,
      OGP_WIDTH -
        AUTHOR_LIST_WIDTH / 2 -
        AUTHOR_LIST_MARGIN -
        (AUTHOR_IMAGE_SIZE * authors.length +
          AUTHOR_IMAGE_GAP * (authors.length - 1)) /
          2 +
        (AUTHOR_IMAGE_SIZE + AUTHOR_IMAGE_GAP) * index,
      OGP_HEIGHT - AUTHOR_IMAGE_SIZE - AUTHOR_LIST_MARGIN,
      AUTHOR_IMAGE_SIZE,
      AUTHOR_IMAGE_SIZE,
    );
    ctx.restore();
  });

  const imgPath = OGP.OGP_DYNAMIC_IMAGE(slug);
  canvas.toBuffer((err, buf) => {
    if (err) throw err;
    if (
      !fs.existsSync(
        path.join(OGP.PUBLIC_DIR_PATH, OGP.OGP_GENERATED_IMAGE_PATH),
      )
    ) {
      fs.mkdirSync(
        path.join(OGP.PUBLIC_DIR_PATH, OGP.OGP_GENERATED_IMAGE_PATH),
      );
    }
    fs.writeFile(path.join(OGP.PUBLIC_DIR_PATH, imgPath), buf, () => {
      console.log(`${title}のOGP画像を生成しました`);
    });
  });
  return imgPath;
};

const createAuthorImage = async (authors: string[]) => {
  const imgs: Image[] = [];
  await Promise.all(
    authors.map(async (author) => {
      const res = await fetch(URL.GITHUB_PROFILE_IMAGE_URL(author));
      if (!res.ok) {
        throw new Error(
          `\`${author}\` の画像が取得できませんでした。存在するGitHubユーザー名を指定してください。`,
        );
      }
      const img = await loadImage(URL.GITHUB_PROFILE_IMAGE_URL(author));
      imgs.push(img);
    }),
  );
  return imgs;
};
