import { Context } from '../../shared/context';
import { dbDeleteDiscovery } from '../../db/discovery';
import { ObjectId } from 'mongodb';
import { inputDeleteDiscovery, outputDeleteDiscovery } from './input/inputDeleteDiscovery';
import { dbDeleteDiscoveryAllItemsForReport } from '../../db/discovery-item';
import { z } from 'zod';

export const apiDeleteDiscovery = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputDeleteDiscovery>;
}): Promise<z.output<typeof outputDeleteDiscovery>> => {
  const { reportId } = input;

  try {
    await dbDeleteDiscovery(new ObjectId(reportId));
  } catch (error) {
    console.error(error);
    return { success: false };
  }

  try {
    await dbDeleteDiscoveryAllItemsForReport(new ObjectId(reportId));
  } catch (error) {
    console.error(error);
  }

  return {
    success: true,
  };
};
