import Database from 'better-sqlite3';

type SQLiteFilenameType = string;
const defaultSQLiteFilename: SQLiteFilenameType = 'sqlite.db';

export type SQLiteConfigType = Partial<{
  filename: SQLiteFilenameType;
}>;

export class SQLite {
  filename: SQLiteFilenameType = defaultSQLiteFilename;
  db: Database.Database;

  constructor(config?: SQLiteConfigType) {
    if (config?.filename) {
      this.filename = config.filename;
    }

    this.db = new Database(this.filename, { verbose: console.log });
  }
}
