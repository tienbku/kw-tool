import { IModifier } from './IModifier';

export interface ISuggestion {
  seed: string;
  suggestion: string;
  modifier: IModifier;
}
