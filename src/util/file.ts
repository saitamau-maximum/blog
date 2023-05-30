import fsp from 'fs/promises';
import path from 'path';

export const findFilesInDeep = async (
  dir: string,
  ext?: string,
): Promise<string[]> => {
  const dirents = await fsp.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? findFilesInDeep(res, ext) : res;
    }),
  );
  return Array.prototype.concat(...files).filter((file) => {
    return ext ? file.endsWith(ext) : true;
  });
};
