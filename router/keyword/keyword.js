const express = require('express');
const mecab = require('mecab-ya');
const router = express.Router();
const db = require('../../models');

const { Keywords } = db;     // db.Keyword
const { OneLine } = db;     // db.OneLine

/* 
메인 페이지 - 한 줄 외치기
    # 키워드
*/

// 임의의 데이터
// const sentences = [
//     '축제는 다양한 공연과 이벤트가.',
//     '축제의 분위기는 너무 흥미로워요.',
//     '축제에 참여하면 색다른 경험을.',
//     '이번 축제는 예상보다 흥미로웠어요.',
//     '축제에서 새로운 사람들을 만나요.',
//     '축제의 다채로운 프로그램이.',
//     '축제에는 많은 사람들이 모여요.',
//     '축제에서 즐길 거리가 많아요.',
//     '축제의 다채로운 문화행사가.',
//     '축제에서 다양한 음식을 즐겨요.',
//     '축제에 예상치 못한 이벤트가.',
//     '축제에서 새로운 취미를 발견해요.',
//     '축제의 다양한 푸드트럭이 좋아요.',
//     '축제에서 다양한 문화를 경험해요.',
//     '축제의 분위기가 너무 흥미로워요.'
// ];

let sentences;

// mecab으로 keyword 추출하기
function extractKeyword(sentences) {
    return new Promise((resolve, reject) => {
        let filteredObject = {};
        let filteredResult = sentences.map(sentence => {
            return new Promise((resolve, reject) => {
                mecab.pos(sentence, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        let eachResult = result
                            .filter(([word, pos]) => pos == 'NNG')
                            .map(([word, pos]) => word);
                        filteredObject[sentence] = eachResult;
                        resolve();
                    }
                });
            });
        });

        Promise.all(filteredResult)
            .then(() => {
                resolve(filteredObject);
            })
            .catch(err => {
                reject(err);
            });
    });
}

// 가장 많이 나온 keyword 상위 10개 키워드 추출하기
function rankingKeyword(filteredObject) {
    let keywordCounts = {};

    for (const sentence in filteredObject) {
        const keywords = filteredObject[sentence];
        for (const keyword of keywords) {
            keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        }
    }

    // 키워드 빈도를 기준으로 내림차순 정렬
    const sortedKeywords = Object.keys(keywordCounts).sort((a, b) => keywordCounts[b] - keywordCounts[a]);

    // 상위 10개 키워드 추출
    const topKeywords = sortedKeywords.slice(0, 10);

    return topKeywords;
}

// keyword DB에 저장하기
async function saveDB(topKeywords) {
    try {
        // 저장할 객체 만들기
        const saveKeyword = topKeywords.map(async keyword => {
            const newKeyword = await Keywords.build({ keyword });
            return newKeyword.save();
        });
        console.log('keyword가 db에 잘 저장되었습니다.');
    } catch(err) {
        // 에러 확인
        console.error('Error saving keywords to the database:', err);
    }
}

// OneLine DB 에서 데이터 가져오기
async function getAllSentences() {
    try {
        // content 부분만 가져와서 리스트 sentencesList 만들기
        const sentencesList = await OneLine.findAll({ attributes: ['content'] });
        sentences = sentencesList.map(sentence => sentence.content);

        // keyword 추출하기
        const filteredObject = await extractKeyword(sentences);

        // 가장 많이 나온 keyword 상위 10개 키워드 추출하기
        const topKeywords = rankingKeyword(filteredObject);

        // keyword DB에 저장하기
        await saveDB(topKeywords);
    } catch (error) {
        console.error('Error fetching sentences:', error);
        return []; // 에러 발생 시 빈 배열 반환
    }
}

// Keyword DB의 모든 데이터 삭제 후 getAllSentences 함수 실행
async function clearDB() {
    try {
        // Keyword DB의 모든 데이터 삭제
        await Keywords.destroy({
            where: {}, // 모든 데이터 삭제
            truncate: true // AUTO_INCREMENT를 재설정
        });

        // getAllSentences 함수 실행
        await getAllSentences();
    } catch (error) {
        console.error('Error clearing and fetching data:', error);
    }
}

// 30분 주기로 clearDB 함수 실행
setInterval(clearDB, 30 * 60 * 1000);

// sentences 전역변수 만들기
clearDB();

// GET /keywords
router.get('/', async (req, res) => {
    try {
        // DB에서 저장된 키워드 가져오기
        const keywords = await Keywords.findAll({ attributes: ['id', 'keyword'] });

        // 응답으로 키워드 보내기
        res.json({ keywords });
    } catch (err) {
        console.error(`error : ${err}`);
        res.status(500).json({ err });
    }
});

module.exports = router;