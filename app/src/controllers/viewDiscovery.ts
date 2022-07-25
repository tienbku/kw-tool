import path from 'path';
import { readFile } from 'fs-extra';
import { PUBLIC_DIR } from '../constants';
import { Request, Response } from 'express';

type Req = Request<{ id: string }>;

export const viewDiscovery = async (req: Req, res: Response) => {
  const id = req.params.id;

  if (!id) {
    console.error('[viewDiscovery]: No id provided');
    return res.redirect('/dashboard');
  }

  const template = path.join(PUBLIC_DIR, 'discovery.html');
  const file = await readFile(template);
  const html = file.toString().replace(
    '<!--{{data}}-->',
    `
      <script>
        window.__id = ${JSON.stringify(id)};
      </script>
    `,
  );

  return res.send(html);
};
