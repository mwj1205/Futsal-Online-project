import express from 'express';
import { prisma } from '../utils/prisma/prismaClient.js';

const router = express.Router();

// 가챠 비용 설정(임의 설정)
const gachaCost1 = 100; // 1장 가챠 비용
const gachaCost2 = 1000; // 10장 가챠 비용

// 가챠 실행
router.post('/users/:userId/gacha', async (req, res) => {
    const { userId } = req.params;
    const { numDraws } = req.body;  // 몇 장을 뽑을 것인지 (1장 또는 10장)

    const totalCost = numDraws === 1 ? gachaCost1 : gachaCost2;

    try {
        // 유저 정보 가져오기
        const user = await prisma.users.findUnique({
            where: { id: parseInt(userId) },
            include: { storage: true },
        });

        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 골드 부족 체크
        if (user.cash < totalCost) {
            return res.status(400).json({ error: '골드가 부족합니다.' });
        }

        // 골드 차감
        const updatedUser = await prisma.users.update({
            where: { id: parseInt(userId) },
            data: { cash: { decrement: totalCost } },
        });

        // 전체 BaseCard에서 무작위로 카드를 뽑음
        const baseCards = await prisma.baseCard.findMany();
        let newCards = [];

        for (let i = 0; i < numDraws; i++) {
            const randomIndex = Math.floor(Math.random() * baseCards.length);
            const drawnBaseCard = baseCards[randomIndex];

            // 새로운 UserCard 생성
            const newCard = await prisma.userCard.create({
                data: {
                    playername: drawnBaseCard.name,
                    position: drawnBaseCard.position,
                    userid: user.id,
                },
            });

            // UserCard를 Storage에 추가
            await prisma.storage.create({
                data: {
                    user: { connect: { id: user.id } },
                    card: { connect: { id: newCard.id } },
                },
            });

            newCards.push(newCard);
        }

        res.json({ success: true, newCards, remainingCash: updatedUser.cash });
    } catch (error) {
        res.status(500).json({ error: '가챠 실행 중 오류가 발생했습니다.' });
    }
});

export default router;
