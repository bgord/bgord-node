type SQLiteFilenameType = string;
const defaultSQLiteFilename: SQLiteFilenameType = 'sqlite.db';

export type SQLiteConfigType = Partial<{
  filename: SQLiteFilenameType;
}>;

export class SQLite {
  filename: SQLiteFilenameType = defaultSQLiteFilename;

  constructor(config?: SQLiteConfigType) {
    if (config?.filename) {
      this.filename = config.filename;
    }
  }
}
