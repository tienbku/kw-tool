import { Context } from '../../shared/context';
import { dbListDiscovery } from '../../db/discovery';
import { IDiscoveryForList } from '../../types/IDiscoveryForList';

export const apiListDiscovery = async ({ ctx }: { ctx: Context }): Promise<IDiscoveryForList[]> => {
  const results = await dbListDiscovery();
  return results.map((result) => ({
    ...result,
    _id: result._id.toString(),
  }));
};
