import wink from 'wink-nlp';
import { uniq } from 'lodash';
import model from 'wink-eng-lite-web-model';

const nlp = wink(model, ['pos']);
const its = nlp.its;

export const getLemmas = (kw: string): string[] => {
  const doc = nlp.readDoc(kw);
  return uniq(doc.tokens().out<string>(its.lemma));
};
