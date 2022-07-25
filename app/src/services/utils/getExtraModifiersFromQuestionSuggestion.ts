import * as natural from 'natural';
import { POS_MODIFIERS, POS_QUESTIONS } from '../../shared/text';

const lexicon = new natural.Lexicon('EN', 'N');
const ruleSet = new natural.RuleSet('EN');
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

export const getExtraModifiersFromQuestionSuggestion = (suggestion: string, questionMod: string, seed: string): string[] => {
  const modifiers: string[] = [];
  const words = suggestion.split(' ');
  const firstKeywordWord = seed.split(' ')[0];

  if (
    tagger &&
    tagger.tag !== undefined &&
    !suggestion.startsWith(`${questionMod} ${seed.split(' ')[0]}`) &&
    !modifiers.includes(words.slice(0, 2).join(' '))
  ) {
    const mods: string[] = [];
    const pos = tagger.tag(words);

    if (pos.taggedWords.length > 1 && POS_QUESTIONS.includes(pos.taggedWords[0].tag) && POS_MODIFIERS.includes(pos.taggedWords[1].tag)) {
      const modifier = words.slice(0, 2).join(' ');
      mods.push(modifier);

      if (POS_MODIFIERS.includes(pos.taggedWords[2].tag) && pos.taggedWords[2].token !== firstKeywordWord) {
        const modifier = words.slice(0, 3).join(' ');
        mods.push(modifier);
      }
    }

    if (mods.length > 0) {
      for (const mod of mods) {
        modifiers.push(mod);
      }
    }
  }

  return modifiers;
};
