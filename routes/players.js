import express from 'express';
import { prisma } from '../utils/prisma/prismaClient.js';

const router = express.Router();

// 전체 카드 목록 조회
router.get('/basecards', async (req, res) => {
    try {
        const baseCards = await prisma.baseCard.findMany();
        res.json({ baseCards });
    } catch (error) {
        res.status(500).json({ error: '카드 목록을 불러오는 데 실패했습니다.' });
    }
});

// 사용자가 보유한 카드 목록 조회
router.get('/users/:userId/cards', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const userCards = await prisma.storage.findMany({
            where: { userid: parseInt(userId) },
            include: {
                card: true, // UserCard 정보를 함께 불러옴
            },
        });

        if (!userCards) {
            return res.status(404).json({ error: '보유한 카드를 찾을 수 없습니다.' });
        }

        res.json({ ownedCards: userCards });
    } catch (error) {
        res.status(500).json({ error: '보유 카드 목록을 불러오는 데 실패했습니다.' });
    }
});

export default router;
