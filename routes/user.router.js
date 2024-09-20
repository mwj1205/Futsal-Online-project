import express from 'express';
import { prisma } from '../utils/prisma/prismaClient.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import joi from 'joi';

const cashAmountSchema = joi.object({
  amount: joi.number().integer().min(100).messages({
    'number.base': '캐시의 양은 숫자여야 합니다.',
    'number.integer': '캐시의 양은 정수여야 합니다.',
    'number.min': '100원 이상 충전해야 합니다.',
  }),
});

const router = express.Router();

router.post('/user/getcash', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    const { amount } = await cashAmountSchema.validateAsync(req.body);

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        cash: { increment: amount },
      },
    });

    return res.status(200).json({
      message: `${amount}캐시 획득`,
      name: updatedUser.nickname,
      cash: updatedUser.cash,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
