import { uniq } from 'lodash';
import { QUESTIONS } from './text';
import { IIntent } from '../types/IIntent';

export const getKeywordIntent = (kw: string): string[] => {
  const intents: IIntent[] = [];

  for (const inf of INFORMATIONAL) {
    if (kw.includes(inf)) {
      intents.push('informational');
      break;
    }
  }

  for (const com of COMMERCIAL) {
    if (kw.includes(com)) {
      intents.push('commercial');
      break;
    }
  }

  for (const tran of TRANSACTIONAL) {
    if (kw.includes(tran)) {
      intents.push('transactional');
      break;
    }
  }

  for (const post of POST_PURCHASE) {
    if (kw.includes(post)) {
      intents.push('post-purchase');
      break;
    }
  }

  if (!intents.includes('informational')) {
    for (const nav of NAVIGATIONAL) {
      if (kw.includes(nav)) {
        intents.push('navigational');
        break;
      }
    }
  }

  if (intents.length === 0) {
    intents.push('unknown');
  }

  return intents;
};

const INFORMATIONAL = uniq([
  ...QUESTIONS,
  'ideas',
  'how-to',
  'diy',
  'have',
  'tip',
  'guide',
  'wikihow',
  'post',
  'resource',
  'what',
  'who',
  'why',
  'when',
  'where',
  'how',
  'recipe',
  'homemade',
  'resource',
  'reddit',
  'quora',
  'forum',
  'blogspot',
  'blogger',
  'youtube',
  'pinterest',
  'document',
  'publication',
  'definition',
  'article',
  'blog',
  'news',
  'types',
  'materials',
  'uses',
  'wikipedia',
  'category',
  'categories',
  'archive',
  'about',
  'list',
  'infographic',
  'study',
  'stories',
  'photo',
  'picture',
  'image',
  'gallery',
  'guide',
  'review',
  'discussion',
  'pdf',
  'video',
]);

const TRANSACTIONAL = uniq([
  'shop',
  'sell',
  'store',
  'kijiji',
  'craigslist',
  'gumtree',
  'cart',
  'checkout',
  'collections',
  'products',
  'trial',
  'sale',
  'coupon',
  'buy',
  'subscribe',
  'collections',
  'amazon',
  'aliexpress',
  'alibaba',
  'ebay',
  'wish',
  'wayfair',
  'product',
  'homedepot',
  'lowes',
  'listing',
  'classifieds',
  'menards',
  'sears',
  'target',
  'toysrus',
  'walmart',
  'etsy',
]);

const COMMERCIAL = uniq([
  'quote',
  'review',
  'pricing',
  'price',
  'research',
  'review',
  'guide',
  'pricing',
  'price',
  'list',
  'research',
  'vs',
  'comparison',
  'compare',
  'best',
  'worst',
  'pricing',
  'price',
  'cost',
  'calculator',
  'estimator',
  'angi',
  'homeadvisor',
  'bbb',
  'yelp',
  'tripadvisor',
  'thumbtack',
  'classifieds',
  'mapquest',
  'thebluebook',
  'top',
  'directory',
  'types of',
  'options',
  'near-me',
  'near me',
  'used',
  'new',
]);

const POST_PURCHASE = uniq(['warranty', 'clean', 'returns', 'return', 'shipping', 'broken', 'fix', 'fixing']);

const NAVIGATIONAL = uniq(['login', 'signup', 'contact', 'twitter', 'instagram', 'facebook', 'linkedin']);
