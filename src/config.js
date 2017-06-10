import level from 'level';
import NodeCache from 'node-cache';

export const myCache = new NodeCache();
export const db = level('../db');
export const port = process.env.PORT || 1337;
export const appName = 'PlaceMorty';
