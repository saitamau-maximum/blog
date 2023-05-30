import { z } from 'zod';

import { ERROR } from '@/constants/error';

const relaySchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string(),
  blogs: z.array(
    z.object({
      day: z.number(),
      author: z.string().nullable(),
      slug: z.string().nullable(),
      title: z.string().nullable(),
    }),
  ),
});

export const parseStrToRelay = (str: string, filename: string) => {
  const jsonRelay = JSON.parse(str);
  const relay = relaySchema.safeParse(jsonRelay);
  if (!relay.success) {
    throw new Error(
      `[${filename}] ${
        ERROR.BLOG_RELAY_PARSER.RELAY_SCHEMA_ERROR
      } ${JSON.stringify(relay.error)}`,
    );
  }
  return relay.data;
};
