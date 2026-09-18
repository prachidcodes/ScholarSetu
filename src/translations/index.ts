import { SupportedLanguage, TranslationDictionary } from './types';
import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { gu } from './gu';
import { bn } from './bn';
import { or } from './or';
import { te } from './te';
import { ta } from './ta';

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  hi,
  mr,
  gu,
  bn,
  or,
  te,
  ta,
};

export type { SupportedLanguage, LanguageOption, TranslationDictionary } from './types';
