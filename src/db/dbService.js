import Database from "tauri-plugin-sql-api";
class DatabaseService {
  db;
  dbReady;

  constructor() {
    this.dbReady = this.initDatabase();
  }

  async initDatabase() {
    try {
      this.db = await Database.load("sqlite:pinote.db");

      // 创建 key-value 表，如果不存在的话
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS key_value (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `);
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error; // 可以选择抛出异常以便外部处理
    }
  }

  async getDbInstance() {
    await this.dbReady; // 确保初始化完成
    return this.db;
  }
}

export default new DatabaseService();
