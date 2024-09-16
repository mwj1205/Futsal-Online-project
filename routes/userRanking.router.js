import express from 'express';
import { prisma } from '../utils/prisma/prismaClient.js';

const router = express.Router();

// 유저 랭킹 조회 API
router.get('/rankings', async (req, res, next) => {
  try {
    // body에 대한 검증 필요
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;

    const users = await prisma.users.findMany({
      select: {
        nickname: true,
        rating: true,
      },
      orderBy: { rating: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const userRanking = users.map((user, index) => ({
      ranking: (page - 1) * limit + index + 1,
      name: user.nickname,
      rating: user.rating,
    }));

    return res.status(200).json(userRanking);
  } catch (error) {
    next(error);
  }
});

export default router;
