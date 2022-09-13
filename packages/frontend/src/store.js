import create from 'zustand';

const CLEAN_STATE_FORM = {
  position: '',
  category: 'none',
  country: 'none',
  experience: '0',
  english: '',
  employmentTypes: [],
  skills: [],
  details: '',
};

const FILLED_FORM = {
  position: 'Senior Javascript Developer',
  category: 'JavaScript',
  country: 'UA',
  experience: '48',
  english: 'fluent',
  employmentTypes: ['full_time', 'part_time', 'remote_work'],
  skills: ['React', 'Javascript', 'Solidity', 'Hardhat'],
  details:
    'I have 5 years of experience. The first year I worked with HTML layouts and Wordpress custom themes (PHP) on Upwork platform. Then I worked in a small product company and I was doing everything related to the frontend - HTML layouts according to templates and logic on Vue.js. Then I have been working for a large company for the 5 months on the Middle Fullstack position - React, Typescript, Node. The last 7 months I have been working as Vue.js developer on startup.',
};

// eslint-disable-next-line import/prefer-default-export
export const useStore = create((set) => ({
  newProfileForm: FILLED_FORM,
  setProfileForm: (nextProfileForm) => set({ newProfileForm: nextProfileForm }),
}));
