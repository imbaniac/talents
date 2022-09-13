import {
  COUNTRIES_LIST,
  DEVELOPMENT_JOB_OPTIONS,
  ENGLISH_LEVELS,
  EXPERIENCE_GRADE,
} from './constants';

export const displayExperience = (value) => {
  return EXPERIENCE_GRADE.find((opt) => opt.value === value).displayLabel;
};

export const displayEnglish = (value) => {
  return `English ${
    ENGLISH_LEVELS.find((opt) => opt.value === value).displayLabel
  }`;
};

export const displayCategory = (value) => {
  return DEVELOPMENT_JOB_OPTIONS.find((opt) => opt.value === value)
    .displayLabel;
};

export const displayCountry = (value) => {
  if (value === 'none') return 'Not specified';
  return COUNTRIES_LIST.find((country) => country.code === value).name;
};

export const getEmoji = (bool) => (bool ? `✅` : `⛔️`);
