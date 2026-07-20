import Database from 'better-sqlite3';
import { resolve } from 'node:path';

const dbPath = resolve(process.cwd(), '../database/dev.sqlite');

console.log('cwd:', process.cwd());
console.log('databasePath:', dbPath);


export const db = new Database(dbPath);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');
