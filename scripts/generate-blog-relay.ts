import { bold, green, red, blue } from "kleur";
import prompts, { PromptObject } from "prompts";
import path from "path";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";

const RELAY_DIR = path.join(__dirname, "../relay");

const today = new Date();

type Relay = {
  title: string;
  slug: string;
  description: string;
  date: string;
  blogs: {
    day: number;
    /** string: 著者が予約済みの場合、null: 予約されていない場合（その日は空欄） */
    author: string | null;
    /** string: ブログが書かれた場合、null: まだ書かれていない場合 */
    slug: string | null;
    title: string | null;
  }[];
};

const questions: PromptObject[] = [
  {
    type: "text",
    name: "title",
    message: "ブログリレーのタイトルを入力してください",
    validate: (value) => {
      if (value.length < 1) {
        return "タイトルは必須です";
      }
      return true;
    },
  },
  {
    type: "text",
    name: "slug",
    message: "ブログリレーのスラッグを入力してください",
    validate: (value) => {
      const regex = /^[a-z0-9-]+$/;
      if (value.length < 1) {
        return "スラッグは必須です";
      }
      if (!regex.test(value)) {
        return "スラッグは半角英数字とハイフンのみで入力してください";
      }
      return true;
    },
  },
  {
    type: "text",
    name: "description",
    message: "ブログリレーの説明を入力してください",
    validate: (value) => {
      if (value.length < 1) {
        return "説明は必須です";
      }
      return true;
    },
  },
  {
    type: "select",
    name: "date",
    message: "ブログリレーの開催月を選択してください",
    choices: Array.from({ length: 12 }, (_, i) => {
      let year = today.getFullYear();
      let month = today.getMonth() + i + 1;
      if (month > 12) {
        month -= 12;
        year += 1;
      }
      const disp = `${year}-${month}`;
      return {
        title: disp,
        value: disp,
      };
    }),
  },
];

(async () => {
  const response = await prompts(questions);

  const maxDayCount = new Date(
    parseInt(response.date.split("-")[0], 10),
    parseInt(response.date.split("-")[1], 10),
    0
  );

  const advent: Relay = {
    title: response.title,
    slug: response.slug,
    description: response.description,
    date: response.date,
    blogs: Array.from({ length: maxDayCount.getDate() }, (_, i) => ({
      day: i + 1,
      author: null,
      slug: null,
      title: null,
    })),
  };

  const adventPath = path.join(RELAY_DIR, `${response.slug}.json`);
  if (existsSync(adventPath)) {
    console.log(
      bold(
        red(
          "ブログリレーの設定ファイルが既に存在します、違うslugを入力してください"
        )
      )
    );
    console.log(blue(path.relative(process.cwd(), adventPath)));
    return;
  }
  await writeFile(adventPath, JSON.stringify(advent, null, 2));

  console.log(bold(green("ブログリレーの設定ファイルを生成しました")));
  console.log(blue(path.relative(process.cwd(), adventPath)));
})();
