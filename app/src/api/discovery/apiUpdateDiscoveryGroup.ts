import { Context } from '../../shared/context';
import { z } from 'zod';
import { inputUpdateDiscoveryGroup, outputUpdateDiscoveryGroup } from './input/inputUpdateDiscoveryGroup';
import { ObjectId } from 'mongodb';
import { dbGetDiscovery, dbUpdateDiscovery } from '../../db/discovery';
import { IDiscovery } from '../../types/IDiscovery';
import { IKeywordGroup } from '../../types/IKeywordGroup';
import { uniq } from 'lodash';

export const apiUpdateDiscoveryGroup = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputUpdateDiscoveryGroup>;
}): Promise<z.output<typeof outputUpdateDiscoveryGroup>> => {
  const reportId = new ObjectId(input.reportId);

  const report = await dbGetDiscovery<Pick<IDiscovery, 'groups'>>(reportId, { groups: 1 });
  if (!report) {
    return {
      success: false,
    };
  }

  const { action, group, keywords } = input;
  const newGroups: IKeywordGroup[] = [];
  const currentGroups = report.groups || [];

  if (!currentGroups.find((g) => g.name === group)) {
    currentGroups.push({ name: group, count: 0, keywords: [] });
  }

  let count = 0;
  for (const existingGroup of currentGroups) {
    if (existingGroup.name === group) {
      if (action === 'add') {
        const newKeywords = [...existingGroup.keywords, ...keywords];
        existingGroup.keywords = uniq(newKeywords);
        count = newKeywords.length;
        existingGroup.count = count;
      } else if (action === 'remove') {
        const newKeywords = existingGroup.keywords.filter((keyword) => !keywords.includes(keyword));
        existingGroup.keywords = newKeywords;
        count = newKeywords.length;
        existingGroup.count = count;
      }
      newGroups.push(existingGroup);
    } else {
      newGroups.push(existingGroup);
    }
  }

  try {
    await dbUpdateDiscovery(reportId, { groups: newGroups });
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  return { success: true, count };
};
