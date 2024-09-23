import express from 'express';
import {prisma} from '../utils/prisma/prismaClient.js';

const router = express.Router();

import { allPlayers } from './players.js';

// 유저 보유 골드
let userGold = 1000; // 예시로 1000 골드 보유 중(임의)

// 가챠에 필요한 골드(임의)
const gachaCost1 = 100; // 1장 가챠에 필요한 골드
const gachaCost2 = 1000;  // 10장 가챠에 필요한 골드 (할인 적용)


function updateGoldDisplay() {
    const goldElement = document.getElementById('userGold');
    goldElement.textContent = `보유 골드: ${userGold}`;
}


// 가챠 로직 (선수 1명 뽑기)
function drawPlayer() {
    const randomIndex = Math.floor(Math.random() * allPlayers.length);
    return allPlayers[randomIndex];
}

// 가챠 실행 함수
function performGacha(numDraws) {
    const totalCost = numDraws === 1 ? gachaCost1 : gachaCost2;

    if (userGold < totalCost) {
        alert('골드가 부족합니다.');
        return;
    }

    // 골드 차감
    userGold -= totalCost;
    updateGoldDisplay();

    for (let i = 0; i < numDraws; i++) {
        const drawnPlayer = drawPlayer();
        if (!ownedPlayers.includes(drawnPlayer)) {
            ownedPlayers.push(drawnPlayer);  // 새로운 선수를 보유 선수 목록에 추가
        }
    }
}

// 1장 가챠 버튼
document.getElementById('singleGachaBtn').addEventListener('click', () => {
    performGacha(1);
});

// 10장 가챠 버튼
document.getElementById('multiGachaBtn').addEventListener('click', () => {
    performGacha(10);
});

// 페이지 로드 시 초기 선수 목록과 골드 상태 표시
window.onload = () => {
    playerList();
    updateGoldDisplay();
};