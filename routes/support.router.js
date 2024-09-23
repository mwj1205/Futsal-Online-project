import express from 'express';
import { prisma } from '../utils/prisma/prismaClient.js';
import authMiddleware from '../middlewares/auth.middleware.js';


//API 사용 /api/support/MF,DF,FW
//주요스탯이 2씩 상승합니다.

const router = express.Router();

// 스쿼드 스탯 상승 함수
async function increaseStat(userId, position) {
  // 유저의 스쿼드와 해당 스쿼드의 카드 정보 가져오기
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      squad: {
        include: {
          player1: true, // FW 
          player2: true, // MF 
          player3: true, // DF 
        },
      },
    },
  });

  if (!user || !user.squad) {
    throw new Error('유저 혹은 스쿼드가 없습니다');
  }

  // 스탯 상승 처리
  let updatedSquad = {};
  if (position === 'FW') {
    // FW의 shoot 스탯을 2 증가시킴
    if (user.squad.player1) {
      updatedSquad = await prisma.squad.update({
        where: { id: user.squad.id },
        data: {
          player1: {
            update: {
              shoot: { increment: 2 }, // 공격수의 슛 스탯 2 증가
            },
          },
        },
      });
    }
  } else if (position === 'MF') {
    // MF의 pass 스탯을 2 증가시킴
    if (user.squad.player2) {
      updatedSquad = await prisma.squad.update({
        where: { id: user.squad.id },
        data: {
          player2: {
            update: {
              pass: { increment: 2 }, // 미드필더의 패스 스탯 2 증가
            },
          },
        },
      });
    }
  } else if (position === 'DF') {
    // DF의 defense 스탯을 2 증가시킴
    if (user.squad.player3) {
      updatedSquad = await prisma.squad.update({
        where: { id: user.squad.id },
        data: {
          player3: {
            update: {
              defense: { increment: 2 }, // 수비수의 방어 스탯 2 증가
            },
          },
        },
      });
    }
  } else {
    throw new Error('잘못된 입력');
  }

  return updatedSquad;
}

// 스탯 지원
router.post('/support/:position', authMiddleware, async (req, res, next) => {
  const { position } = req.params;
  const userId = req.user.id;

  try {
    const updatedSquad = await increaseStat(userId, position);

    return res.status(200).json({
      message: `서포터의 응원으로 ${position}의 주 능력치가 2 상승했습니다.`,
      updatedSquad,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
