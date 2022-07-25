import { db } from '../shared/db';

export const dbCreateIndexes = async () => {
  if (!db) {
    return;
  }

  console.log('Creating DB indexes');

  await db.collection('discovery').createIndex(
    {
      user: 1,
    },
    {
      name: 'discovery_for_user_list_index',
    },
  );

  await db.collection('discovery').createIndex(
    {
      _id: 1,
      user: 1,
    },
    {
      name: 'discovery_for_user_index',
    },
  );

  await db.collection('discoveryItem').createIndex(
    {
      report: 1,
    },
    {
      name: 'discovery_item_for_report_list_index',
    },
  );

  await db.collection('discoveryItem').createIndex(
    {
      report: 1,
      keyword: 1,
    },
    {
      unique: true,
      name: 'discovery_item_for_report_list_index_uniq',
    },
  );
};
