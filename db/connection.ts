import * as SQLite from "expo-sqlite";

// SINGLETON DATABASE to
export class Database {
  private static instance: Database;
  private db: SQLite.SQLiteDatabase | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async open(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync("client.db");
      this.isConnected = true;
    }
    return this.db;
  }

  public async close(): Promise<void> {
    if (this.db) {
      try {
        await this.db.closeAsync();
      } catch (error) {
        console.error("Error closing the database:", error);
      } finally {
        this.db = null;
        this.isConnected = false;
      }
    }
  }

  public async getConnection(): Promise<SQLite.SQLiteDatabase> {
    if (!this.isConnected) {
      console.log("Database not connected. Attempting to reconnect...");
      try {
        await this.open();
        console.log("CONNECTED");
      } catch (error) {
        throw new Error("Unable to reconnect to the database.");
      }
    }
    if (!this.db) {
      throw new Error("Database connection is not established.");
    }
    return this.db;
  }
}
