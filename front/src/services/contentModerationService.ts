import { Filter } from 'bad-words';
import frenchBadwords from 'french-badwords-list';

// Initialize filters
const englishFilter = new Filter();
const frenchFilter = new Filter({ emptyList: true });
frenchFilter.addWords(...frenchBadwords.array);

export interface ContentWarning {
  type: 'profanity' | 'harassment' | 'threats' | 'discrimination';
  word: string;
  index: number;
}

export const checkContent = (content: string): ContentWarning[] => {
  const warnings: ContentWarning[] = [];
  
  // Check English profanity
  const englishWords = content.split(/\s+/);
  englishWords.forEach((word, idx) => {
    if (englishFilter.isProfane(word)) {
      warnings.push({
        type: 'profanity',
        word: word,
        index: content.indexOf(word),
      });
    }
  });

  // Check French profanity
  const frenchWords = content.split(/\s+/);
  frenchWords.forEach((word, idx) => {
    if (frenchFilter.isProfane(word)) {
      warnings.push({
        type: 'profanity',
        word: word,
        index: content.indexOf(word),
      });
    }
  });

  // Additional contextual checks for harassment, threats, and discrimination
  const contextualPatterns = {
    harassment: [
      /\b(harass|bully|mock|taunt|humiliate|intimidate|torment)\b/i,
      /\b(harceler|intimider|moquer|tourmenter|humilier)\b/i
    ],
    threats: [
      /\b(threaten|kill|murder|attack|hurt|destroy)\b/i,
      /\b(menacer|tuer|assassiner|attaquer|blesser|détruire)\b/i
    ],
    discrimination: [
      /\b(discriminate|racist|sexist|bigot|prejudice)\b/i,
      /\b(discriminer|raciste|sexiste|préjugé|bigot)\b/i
    ]
  };

  // Check for contextual warnings
  Object.entries(contextualPatterns).forEach(([type, patterns]) => {
    patterns.forEach(pattern => {
      const matches = content.matchAll(new RegExp(pattern, 'gi'));
      for (const match of matches) {
        if (match.index !== undefined) {
          warnings.push({
            type: type as ContentWarning['type'],
            word: match[0],
            index: match.index,
          });
        }
      }
    });
  });

  return warnings;
};

export const getWarningMessage = (warning: ContentWarning): string => {
  switch (warning.type) {
    case 'profanity':
      return `Contains inappropriate language: "${warning.word}"`;
    case 'harassment':
      return `Potentially harassing content: "${warning.word}"`;
    case 'threats':
      return `Potentially threatening content: "${warning.word}"`;
    case 'discrimination':
      return `Potentially discriminatory content: "${warning.word}"`;
    default:
      return `Inappropriate content detected: "${warning.word}"`;
  }
}; 