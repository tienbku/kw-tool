import path from 'path';
import { readFile } from 'fs-extra';
import { PUBLIC_DIR } from '../constants';
import { Request, Response } from 'express';

type Req = Request<{ reportId: string }>;

export const viewTopicMap = async (req: Req, res: Response) => {
  const reportId = req.params.reportId;
  if (!reportId) {
    console.error('[viewTopicMap]: No id provided');
    return res.redirect('/dashboard');
  }

  const template = path.join(PUBLIC_DIR, 'topic-map.html');
  const file = await readFile(template);
  const html = file.toString().replace(
    '<!--{{data}}-->',
    `
      <script>
        window.__reportId = ${JSON.stringify(reportId)};
      </script>
    `,
  );

  return res.send(html);
};
