import { Router } from "express";

import { prisma } from "../db";
import { formatKst } from "../utils/date";

const router = Router();

// GET /notice: 공지 목록과 각 공지의 이미지
router.get("/", async (_req, res) => {
  const notices = await prisma.notice.findMany({
    orderBy: { id: "asc" },
    include: {
      noticeImgs: {
        select: { id: true, img: true },
        orderBy: { id: "asc" },
      },
    },
  });

  res.json({
    notices: notices.map((notice) => ({
      id: String(notice.id),
      category: notice.category,
      title: notice.title,
      content: notice.content,
      updatedAt: formatKst(notice.updatedAt),
      noticeImgs: notice.noticeImgs,
    })),
  });
});

export default router;
