const express = require('express');
const router = express.Router();
const db = require('../../models');
const fs = require('fs')

// JSON 미들웨어 사용
router.use(express.json());

router.use(express.urlencoded({ extended: false }));

const { OneLine } = db;     // db.OneLine
const { User } = db;        // db.User

// 채팅 메시지 불러오기
router.get('/', async (req, res) => {
  const token = req.headers['authorization'];
  let tokenValue = null;

  if (token) {
    const parts = token.split(" ");
    if (parts.length > 1) {
      tokenValue = parts[1].replace(/^"|"$/g, '');
    }
  }

  const existUser = await User.findOne({ where: { token: tokenValue } });
  const ALLOnelines = await OneLine.findAll({
    attributes: ['id', 'content', 'emoji', 'userId'],
    order: [['createdAt', 'DESC']], // id 필드를 기준으로 오름차순으로
    limit: 80  // 상위 50개 데이터만 가져오기
  });

  // 오름차순으로 정렬
  const sortedOnelines = ALLOnelines.sort((a, b) => a.id - b.id);

  const Onelines = await Promise.all(ALLOnelines.map(async (oneline) => {
    const user = await User.findOne({ where: { id: oneline.userId } });
    let studentId = user.studentId;

    if (!existUser) {
      return {
        ...oneline.get({ plain: true }),
        studentId: studentId.slice(0, studentId.length - 3) + '***',
        content: oneline.content,
        emoji: oneline.emoji
      };
    } else {
      if(existUser.studentId !== studentId) {
        studentId = studentId.slice(0, studentId.length - 3) + '***';
      } 
      return {
        ...oneline.get({ plain: true }),
        studentId: studentId,
        content: oneline.content,
        emoji: oneline.emoji
      };
    }
  }));
  res.status(200).send({shouts: Onelines});
});

// 채팅 메시지 추가(DB에 저장 하고 보내기)
router.post("/", async (req, res) => {
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
      userId: existUser.id,
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