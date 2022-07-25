import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { PythonShell } from 'python-shell';
import { unlink, writeFile } from 'fs-extra';

const py_bin = '/usr/bin/python3';
const py_path = join(__dirname, '../py');

export const callPySimple = async <T>(pyScript: string, data: T): Promise<string[] | undefined> => {
  return new Promise<string[] | undefined>((resolve) => {
    try {
      PythonShell.run(
        pyScript,
        {
          mode: 'text',
          pythonPath: py_bin,
          scriptPath: py_path,
        },
        (err: Error | undefined, results: string[] | undefined) => {
          if (err) {
            console.error(err);
            resolve(undefined);
          } else if (results === undefined) {
            console.error(`[discovery-suggest]: No results for ${pyScript}`);
            resolve(undefined);
          } else {
            resolve(results);
          }
        },
      );
    } catch (err) {
      console.error(err);
    }
  });
};

export const callPy = async <TResponse, TData>(pyScript: string, data: Record<string, TData>): Promise<TResponse | undefined> => {
  const dataFilepath = join('/tmp', uuid() + '.json');

  try {
    console.log(`Writing tmp data to ${dataFilepath} for ${pyScript}`);
    await writeFile(dataFilepath, JSON.stringify(data));
  } catch (e) {
    console.error(e);
    return undefined;
  }

  return new Promise<TResponse | undefined>((resolve) => {
    try {
      PythonShell.run(
        pyScript,
        {
          mode: 'text',
          pythonPath: py_bin,
          scriptPath: py_path,
          args: [dataFilepath],
        },
        (err: Error | undefined, results: string[] | undefined) => {
          unlink(dataFilepath)
            .then(() => {
              console.log(`Deleted tmp data at ${dataFilepath} for ${pyScript}`);
            })
            .catch((err) => {
              console.error(err);
            });

          if (err) {
            console.log(err);
            resolve(undefined);
            return;
          }

          if (results !== undefined && Array.isArray(results) && results.length === 1) {
            const converted: TResponse = JSON.parse(results[0]);
            if (converted) {
              resolve(converted);
            } else {
              resolve(undefined);
            }
          } else {
            resolve(undefined);
          }
        },
      );
    } catch (err) {
      console.log(err);
      resolve(undefined);
    }
  });
};
