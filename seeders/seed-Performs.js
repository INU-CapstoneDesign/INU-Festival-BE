'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 시퀀스를 다시 시작하는 로직 추가
    await queryInterface.sequelize.query('ALTER TABLE Performs AUTO_INCREMENT = 1;');
    await queryInterface.bulkInsert(
      'Performs',
      [
        // ----------------------- 재학생 공연 -----------------------
        {
          name: '포크라인',
          date: '10월 06일',
          day: 'day1',
          time: '18:30 ~ 19:00',
          category: '동아리',
          detail: '안녕하세요! 인천대 대표 어쿠스틱 동아리 포크라인입니다! 가을 축제의 분위기에 맞게 어쿠스틱의 느낌이 물씬 풍기는 곡들로 공연을 구성해보았데요, 서늘해진 날씨지만 여러분의 마음을 따뜻하게 해드릴 노래들 들려드리도록 하겠습니다',
          img: 'temp.img',
        },
        {
          name: '울림',
          date: '10월 06일',
          day: 'day1',
          time: '19:00 ~ 19:30',
          category: '동아리',
          detail: '인천대 대표 밴드 동아리 싸우라비입니다. 2019년 1월에 결성하여 2년째 활동하고 있는 동아리로, 2019년 2월에는 인천대 축제 무대에 섰으며, 2020년 1월에는 인천대 축제 무대에 섰습니다. 이번 가을 축제에서도 싸우라비의 무대를 기대해주세요!',
          img: 'temp.img',
        },
        {
          name: '커플리온스',
          date: '10월 06일',
          day: 'day1',
          time: '19:30 ~ 20:00',
          category: '동아리',
          detail: '인천을 수호하는 두마리 사자 커플리온스',
          img: 'temp.img',
        },
        {
          name: '인스디스',
          date: '12월 12일',
          day: 'day1',
          time: '20:00 ~ 20:30',
          category: '동아리',
          detail: '중앙흑인음악동아리 인스디스. 힙합과 알앤비 음악을 작곡하고 공연하고 있습니다.',
          img: 'temp.img',
        },
        {
          name: '피아노동아리',
          date: '12월 13일',
          day: 'day2',
          time: '19:30 ~ 20:00',
          category: '동아리',
          detail: '피아노를 사랑하는 사람들의 모임입니다. 피아노를 좋아하는 사람이라면 누구나 환영합니다!',
          img: 'temp.img',
        },
        {
          name: '플라워',
          date: '12월 13일',
          day: 'day2',
          time: '20:00 ~ 20:30',
          category: '동아리',
          detail: '플라워는 인천대학교 대표 힙합 동아리입니다. 힙합을 사랑하는 사람들이 모여서 음악을 만들고 공연을 합니다. 이번 축제에서도 많은 관심 부탁드립니다.',
          img: 'temp.img',
        },
        {
          name: '커플리온스',
          date: '12월 14일',
          day: 'day3',
          time: '19:30 ~ 20:00',
          category: '동아리',
          detail: '인천을 수호하는 두마리 사자 커플리온스',
          img: 'temp.img',
        },
        {
          name: '게임동아리',
          date: '12월 14일',
          day: 'day3',
          time: '20:00 ~ 20:30',
          category: '동아리',
          detail: '게임을 좋아하는 사람들의 모임입니다. 게임을 좋아하는 사람이라면 누구나 환영합니다!',
          img: 'temp.img',
        },
        {
          name: '댄스동아리',
          date: '12월 14일',
          day: 'day3',
          time: '20:30 ~ 21:00',
          category: '동아리',
          detail: '댄스를 좋아하는 사람들의 모임입니다. 댄스를 좋아하는 사람이라면 누구나 환영합니다!',
          img: 'temp.img',
        },

        // ----------------------- 연예인 공연 -----------------------
        {
          name: '데이먼스 이어',
          date: '12월 12일',
          day: 'day1',
          time: '21:00 ~ 21:30',
          category: '연예인',
          detail: '안녕하세요! 데이먼스 이어입니다.',
          img: 'DAMONS.png',
        },
        {
          name: '볼빨간 사춘기',
          date: '12월 12일',
          day: 'day1',
          time: '21:30 ~ 22:00',
          category: '연예인',
          detail: '안녕하세요! 볼빨간 사춘기입니다.',
          img: 'BOL.jpeg',
        },
        {
          name: '뉴진스',
          date: '12월 12일',
          day: 'day1',
          time: '22:00 ~ 22:30',
          category: '연예인',
          detail: '안녕하세요! 뉴진스입니다.',
          img: 'New.jpeg',
        },
        {
          name: '블랙핑크',
          date: '12월 13일',
          day: 'day2',
          time: '23:00 ~ 23:30',
          category: '연예인',
          detail: '안녕하세요! 블랙핑크입니다.',
          img: 'BLACKPINK.jpeg',
        },
        {
          name: '아이즈원',
          date: '12월 13일',
          day: 'day2',
          time: '23:30 ~ 24:00',
          category: '연예인',
          detail: '안녕하세요! 아이즈원입니다.',
          img: 'IZONE.jpeg',
        },
        {
          name: '에이핑크',
          date: '12월 13일',
          day: 'day2',
          time: '24:00 ~ 24:30',
          category: '연예인',
          detail: '안녕하세요! 에이핑크입니다.',
          img: 'APINK.jpeg',
        },
        {
          name: '트와이스',
          date: '12월 14일',
          day: 'day3',
          time: '21:30 ~ 22:00',
          category: '연예인',
          detail: '안녕하세요! 트와이스입니다.',
          img: 'Twice.jpeg',
        },
        {
          name: '아이유',
          date: '12월 14일',
          day: 'day3',
          time: '22:00 ~ 22:30',
          category: '연예인',
          detail: '안녕하세요! 아이유입니다.',
          img: 'IU.jpeg',
        },
        {
          name: '방탄소년단',
          date: '12월 14일',
          day: 'day3',
          time: '22:30 ~ 23:00',
          category: '연예인',
          detail: '안녕하세요! 방탄소년단입니다.',
          img: 'BTS.jpeg',
        },
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Performs', null, {});
  },
};
