const express = require('express');
const router = express.Router();
const prisma = require('@prisma/client').PrismaClient;

const prismaClient = new prisma();

// 기회 분배 및  득점 확률 계산 함수
function calculateProb(a, b) {
  return (a ** 2) / (a ** 2 + b ** 2);
}

// 공격 기회 분배 함수
function allocateAttacks(userA_pass, userB_pass, base_attacks = 5, extra_attacks = 10) {
  let userA_attacks = base_attacks;
  let userB_attacks = base_attacks;

  for (let i = 0; i < extra_attacks; i++) {
    const prob_a = calculateProb(userA_pass, userB_pass);
    if (Math.random() < prob_a) {
      userA_attacks += 1;
    } else {
      userB_attacks += 1;
    }
  }

  return { userA_attacks, userB_attacks };
}

// 득점 시뮬레이션 함수
function simulateGoals(userA_shoot, userB_defense, userA_attacks, userB_shoot, userA_defense, userB_attacks) {
  let userA_goals = 0;
  let userB_goals = 0;

  for (let i = 0; i < userA_attacks; i++) {
    const prob_a_goal = calculateProb(userA_shoot, userB_defense);
    if (Math.random() < prob_a_goal) {
      userA_goals += 1;
    }
  }

  for (let i = 0; i < userB_attacks; i++) {
    const prob_b_goal = calculateProb(userB_shoot, userA_defense);
    if (Math.random() < prob_b_goal) {
      userB_goals += 1;
    }
  }

  return { userA_goals, userB_goals };
}

// 경기를 시뮬레이션하는 API 엔드포인트
router.post('/play', async (req, res) => {
  const { userAid, userBid } = req.body;

  try {
    // 두 유저의 스쿼드 정보 가져오기
    const userA = await prismaClient.users.findUnique({
      where: { id: userAid },
      include: { squad: { include: { player1: true, player2: true, player3: true } } }
    });

    const userB = await prismaClient.users.findUnique({
      where: { id: userBid },
      include: { squad: { include: { player1: true, player2: true, player3: true } } }
    });

    if (!userA || !userB) {
      return res.status(404).json({ error: '유저가 발견되지 않았습니다.' });
    }

    // 각 유저의 미드필더, 공격수, 수비수 스탯 추출
    const userA_midfielder_pass = userA.squad[0]?.player2?.pass || 0;
    const userB_midfielder_pass = userB.squad[0]?.player2?.pass || 0;

    const userA_attacker_shoot = userA.squad[0]?.player1?.shoot || 0;
    const userB_defender_defense = userB.squad[0]?.player3?.defense || 0;

    const userB_attacker_shoot = userB.squad[0]?.player1?.shoot || 0;
    const userA_defender_defense = userA.squad[0]?.player3?.defense || 0;

    // Step 1: 공격 기회 분배
    const { userA_attacks, userB_attacks } = allocateAttacks(userA_midfielder_pass, userB_midfielder_pass);

    // Step 2: 득점 시뮬레이션
    const { userA_goals, userB_goals } = simulateGoals(
      userA_attacker_shoot,
      userB_defender_defense,
      userA_attacks,
      userB_attacker_shoot,
      userA_defender_defense,
      userB_attacks
    );

    // 경기 결과 저장
    const matchLog = await prismaClient.matchLog.create({
      data: {
        userA: { connect: { id: userAid } },
        userB: { connect: { id: userBid } },
        scoreA: userA_goals,
        scoreB: userB_goals,
        RatingChangeA: userA_goals - userB_goals, //레이팅 변경
        RatingChangeB: userB_goals - userA_goals, 
      }
    });

    return res.json({
      message: '경기가 끝났습니다.',
      userA_goals,
      userB_goals,
      matchLog
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '예상치 못한 에러' });
  }
});

module.exports = router;
