// 로컬 개발용 예시 데이터. 실행: npx prisma db seed
import "dotenv/config";

import { prisma } from "../src/db";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("seed는 로컬에서만 실행한다 (기존 데이터를 지운다)");
  }

  // 여러 번 실행해도 같은 결과가 나오도록 지우고 다시 넣는다 (NoticeImg는 Cascade로 같이 지워짐)
  await prisma.notice.deleteMany();

  await prisma.notice.create({
    data: {
      category: "공지사항",
      title: "입장 짐검사 및 반입금지 물품 안내",
      content: "안전한 축제를 위해 입장 시 간단한 짐검사를 합니다.\n\n반입 금지: 주류, 장우산, 간이의자",
      noticeImgs: {
        create: [
          { img: "https://placehold.co/600x800/png?text=notice-1" },
          { img: "https://placehold.co/600x800/png?text=notice-2" },
        ],
      },
    },
  });

  await prisma.notice.create({
    data: {
      category: "공지사항",
      title: "축제 기간 귀가버스 안내",
      content: "운행시간: 23시~24시\n탑승위치: 11호관 앞",
    },
  });

  await prisma.notice.create({
    data: {
      category: "분실물",
      title: "분실물 보관 안내",
      content: "분실물은 총학생회 부스에서 보관합니다.",
    },
  });

  console.log("seed 완료:", await prisma.notice.count(), "개 공지");
}

main().finally(() => prisma.$disconnect());
