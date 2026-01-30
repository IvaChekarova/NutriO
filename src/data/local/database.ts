import SQLite from 'react-native-sqlite-storage';

import { runMigrations } from './migrations';

SQLite.enablePromise(true);

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabase({
    name: 'nutrio.db',
    location: 'default',
  });

  return dbInstance;
};

export const initDatabase = async () => {
  const db = await getDatabase();
  await runMigrations(db);
  return db;
};
