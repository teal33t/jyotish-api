import * as SQLite from 'expo-sqlite';
import { Kundli } from './types';

const db = SQLite.openDatabaseAsync('astromonk.db');

const initDatabase = async () => {
  const database = await db;
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS kundli (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rashi INTEGER NOT NULL,
      planets TEXT NOT NULL,
      name TEXT NOT NULL,
      birth_time TEXT NOT NULL,
      birth_place TEXT NOT NULL,
      gender TEXT NOT NULL
    );
  `);
};

const saveKundli = async (kundli: Omit<Kundli, 'id'>) => {
  const database = await db;
  await database.runAsync(
    `INSERT INTO kundli (rashi, planets, name, birth_time, birth_place, gender)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [kundli.rashi, kundli.planets, kundli.name, kundli.birth_time, kundli.birth_place, kundli.gender]
  );
};

const getAllKundli = async (): Promise<Kundli[]> => {
  const database = await db;
  const result = await database.getAllAsync<Kundli>('SELECT * FROM kundli');
  return result;
};

export { initDatabase, saveKundli, getAllKundli };
