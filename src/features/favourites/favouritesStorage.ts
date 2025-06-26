import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

// Initialize database connection
async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('favourites.db');
  }
  return db;
}

export async function initFavoritesTable(): Promise<void> {
  try {
    const database = await getDatabase();
    await database.execAsync(
      'CREATE TABLE IF NOT EXISTS favourites (id TEXT PRIMARY KEY);'
    );
    console.log('Favourites table initialized successfully');
  } catch (error) {
    console.error('SQLite init error:', error);
    throw error;
  }
}

export async function getAllFavouriteIds(): Promise<string[]> {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync('SELECT id FROM favourites;');
    const ids = result.map((row: any) => row.id);
    return ids;
  } catch (error) {
    console.error('SQLite select error:', error);
    throw error;
  }
}

export async function addFavourite(id: string): Promise<void> {
  try {
    const database = await getDatabase();
    await database.runAsync('INSERT OR REPLACE INTO favourites (id) VALUES (?);', [id]);
    console.log(`Added favourite: ${id}`);
  } catch (error) {
    console.error('SQLite insert error:', error);
    throw error;
  }
}

export async function removeFavourite(id: string): Promise<void> {
  try {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM favourites WHERE id = ?;', [id]);
    console.log(`Removed favourite: ${id}`);
  } catch (error) {
    console.error('SQLite delete error:', error);
    throw error;
  }
} 