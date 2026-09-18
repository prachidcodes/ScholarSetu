export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'gu' | 'bn' | 'or' | 'te' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export type TranslationDictionary = Record<string, string>;
