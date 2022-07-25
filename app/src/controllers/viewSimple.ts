import path from 'path';
import { Request, Response } from 'express';

import { readFile } from 'fs-extra';
import { PUBLIC_DIR } from '../constants';

export const viewSimple = (templateName: string) => async (req: Request, res: Response) => {
  const template = path.join(PUBLIC_DIR, templateName);
  const file = await readFile(template);
  const html = file.toString();
  return res.send(html);
};
