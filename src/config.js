import level from 'level';

export const db = level('../db');
export const port = process.env.PORT || 1337;
export const appName = 'Placemorty';
