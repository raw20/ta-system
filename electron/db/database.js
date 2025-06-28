import Database from "better-sqlite3";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ES modules에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

// 데이터베이스 초기화
export function initDatabase() {
  try {
    console.log("🔍 데이터베이스 초기화 시작");

    // 데이터베이스 파일 경로
    const dbPath = join(__dirname, "ta-app.db");
    console.log("🔍 DB 경로:", dbPath);

    // 데이터베이스 연결
    db = new Database(dbPath);
    console.log("✅ 데이터베이스 연결 성공");

    // WAL 모드 설정
    db.pragma("journal_mode = WAL");

    // 스키마 파일 읽기
    const schemaPath = join(__dirname, "schema.sql");
    console.log("🔍 스키마 경로:", schemaPath);

    if (!existsSync(schemaPath)) {
      throw new Error("schema.sql 파일이 존재하지 않습니다: " + schemaPath);
    }

    const schema = readFileSync(schemaPath, "utf8");
    console.log("✅ 스키마 파일 읽기 성공");

    // 스키마 실행
    const statements = schema.split(";").filter((stmt) => stmt.trim());
    console.log(`🔍 실행할 SQL 문 개수: ${statements.length}`);

    statements.forEach((statement, index) => {
      if (statement.trim()) {
        try {
          db.exec(statement);
          if (index < 5) console.log(`✅ SQL ${index + 1} 실행 성공`);
        } catch (error) {
          console.error(`❌ SQL ${index + 1} 실행 실패:`, error.message);
        }
      }
    });

    console.log("✅ 데이터베이스 초기화 완료");
    return db;
  } catch (error) {
    console.error("❌ 데이터베이스 초기화 실패:", error);
    throw error;
  }
}

// 데이터베이스 연결 반환
export function getDatabase() {
  if (!db) {
    initDatabase();
  }
  return db;
}

// 데이터베이스 연결 종료
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log("✅ 데이터베이스 연결 종료");
  }
}
