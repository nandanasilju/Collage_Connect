import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

let prisma: PrismaClient;

const dbPath = path.join(process.cwd(), "prisma", "dev.db");

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`,
  });
  prisma = new PrismaClient({ adapter });
} else {
  if (!(global as any).prisma) {
    const adapter = new PrismaBetterSqlite3({
      url: `file:${dbPath}`,
    });
    (global as any).prisma = new PrismaClient({ adapter });
  }
  prisma = (global as any).prisma;
}

export default prisma;
