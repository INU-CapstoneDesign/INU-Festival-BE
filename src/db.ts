import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// 서버 전체에서 이 prisma 하나만 import 해서 쓴다 (DB 연결을 한 곳에서 관리)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
