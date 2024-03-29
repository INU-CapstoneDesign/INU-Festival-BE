const express = require('express');
const router = express.Router();
const db = require('../../models');
const fs = require('fs')

// JSON 미들웨어 사용
router.use(express.json());

router.use(express.urlencoded({ extended: false }));

const { OneLine } = db;     // db.OneLine
const { User } = db;     // db.User

// 채팅 메시지 불러오기
router.get('/all_messages', async (req, res) => {
  const ALLOnelines = await OneLine.findAll({
    attributes: ['id', 'content', 'emoji', 'userId'],
  });

  const Onelines = await Promise.all(ALLOnelines.map(async (oneline) => {
    const user = await User.findOne({ where: { id: oneline.userId } });
    return {
      ...oneline.get({ plain: true }),
      studentId: user.studentId,
      content: oneline.content,
      emoji: oneline.emoji
    };
  }));
  res.send({shouts: Onelines});
});

// 채팅 메시지 추가(DB에 저장 하고 보내기)
router.post("/add", async (req, res) => {
  const token = req.headers['authorization'];

  // 토큰값 null인지 아닌지 확인하기
  const tokenValue = token ? token.split(" ")[1].replace(/^"|"$/g, '') : null;

  // 토큰값으로 유저 찾기
  const existUser = await User.findOne({ where: { token: tokenValue } });

  // 로그인을 하지 않은 경우
  if (!existUser) {
      return res.status(400).send({ success: false, message: '로그인 먼저 하세요!' });
  } else {
    const { content, emoji } = req.body;
    const newOneLine = await OneLine.create({
      content: content,
      emoji: emoji,
      userId: existUser.id
    });

    const data = {
      studentId: existUser.studentId,
      content: newOneLine.content,
      emoji: newOneLine.emoji
    }
    res.status(201).json(data);
  }
});

module.exports = router;