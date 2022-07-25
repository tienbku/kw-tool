import { Request, Response } from 'express';
import { callPySimple } from '../shared/py';

export const checkPython = async (req: Request, res: Response) => {
  let response: string[] | undefined;

  try {
    response = await callPySimple('check-python.py', {});
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }

  if (!response) {
    return res.status(500).send('No response from python');
  }

  return res.status(200).send(response.join('<br />'));
};
