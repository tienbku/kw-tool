import path from 'path';
import { Request, Response } from 'express';

import { PUBLIC_DIR } from '../constants';

export const viewLogin = async (req: Request, res: Response) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  return res.sendFile(path.join(PUBLIC_DIR, 'login.html'));
};
