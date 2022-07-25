import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Context } from '../../shared/context';
import { dbGetDiscovery } from '../../db/discovery';
import { IDiscovery } from '../../types/IDiscovery';
import { inputGetDiscoveryClusters, outputGetDiscoveryClusters } from './input/inputGetDiscoveryClusters';

export const apiGetDiscoveryClusters = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputGetDiscoveryClusters>;
}): Promise<z.output<typeof outputGetDiscoveryClusters>> => {
  const report = await dbGetDiscovery<Pick<IDiscovery, '_id' | 'clusters' | 'semanticClusters'>>(new ObjectId(input.reportId), {
    _id: 1,
    clusters: 1,
    semanticClusters: 1,
  });

  if (!report) {
    return {
      clusters: [],
      semanticClusters: {},
    };
  }

  return {
    clusters: report.clusters || [],
    semanticClusters: report.semanticClusters || {},
  };
};
