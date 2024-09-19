import express from 'express';
import { prisma } from '../utils/prisma/prismaClient.js';

const router = express.Router();

// 유저를 매칭해서 대결하는 API
router.post('/matchmaking', async (req, res, next) => {
  try {
    // todo: 인증 정보에서 유저 정보 가져오기
    const user = await prisma.users.findFirst({
      where: { id: 1 },
    });

    let opponent = null;
    let currentRange = 10;
    const extendRange = 10;
    const maxRange = 100;

    // 처음엔 +-10부터 시작해서 10씩 점차 늘려나가면서 검색
    // 최대 +-100까지 검색한 후 없다면 매치 실패를 리턴
    while (!opponent && currentRange <= maxRange) {
      opponent = await prisma.users.findMany({
        where: {
          AND: [
            { rating: { gte: user.rating - currentRange } },
            { rating: { lte: user.rating + currentRange } },
            { id: { not: user.id } },
          ],
        },
        orderBy: { rating: 'desc' },
      });

      // 찾은 범위의 유저들 중 하나만 랜덤으로 선택
      if (opponent.length > 0) {
        opponent = opponent[Math.floor(Math.random() * opponent.length)];
      } else {
        opponent = null;
        currentRange += extendRange;
      }
    }

    if (!opponent) {
      const error = new Error('매칭 상대를 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }
    // todo: 유저 대결 기믹

    return res.status(200).json(opponent);
  } catch (error) {
    next(error);
  }
});

export default router;
