-- CreateTable
CREATE TABLE "NoticeImg" (
    "id" SERIAL NOT NULL,
    "img" TEXT NOT NULL,
    "noticeId" INTEGER NOT NULL,

    CONSTRAINT "NoticeImg_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NoticeImg" ADD CONSTRAINT "NoticeImg_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
