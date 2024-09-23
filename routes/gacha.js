import express from 'express';
<<<<<<< Updated upstream
import {prisma} from '../utils/prisma/prismaClient.js';
=======
import { prisma } from '../utils/prisma/prismaClient.js';
>>>>>>> Stashed changes

const router = express.Router();

import { allPlayers } from './players.js';

<<<<<<< Updated upstream
// 유저 보유 골드
let userGold = 1000; // 예시로 1000 골드 보유 중(임의)

// 가챠에 필요한 골드(임의)
const gachaCost1 = 100; // 1장 가챠에 필요한 골드
const gachaCost2 = 1000;  // 10장 가챠에 필요한 골드 (할인 적용)


function updateGoldDisplay() {
=======
// 유저 보유 골드(임의 설정)
let userGold = 1000; // 예시로 1000 골드 보유 중(임의)

// 가챠에 필요한 골드(임의 설정)
const gachaCost1 = 100; // 1장 가챠에 필요한 골드
const gachaCost2 = 1000;  // 10장 가챠에 필요한 골드


function updateGold() {
>>>>>>> Stashed changes
    const goldElement = document.getElementById('userGold');
    goldElement.textContent = `보유 골드: ${userGold}`;
}


// 가챠 로직 (선수 1명 뽑기)
function drawPlayer() {
    const randomIndex = Math.floor(Math.random() * allPlayers.length);
    return allPlayers[randomIndex];
}

<<<<<<< Updated upstream
// 가챠 실행 함수
function performGacha(numDraws) {
=======
// 가챠 실행
async function setGacha(numDraws) {
>>>>>>> Stashed changes
    const totalCost = numDraws === 1 ? gachaCost1 : gachaCost2;

    if (userGold < totalCost) {
        alert('골드가 부족합니다.');
        return;
    }

    // 골드 차감
    userGold -= totalCost;
<<<<<<< Updated upstream
    updateGoldDisplay();

    for (let i = 0; i < numDraws; i++) {
        const drawnPlayer = drawPlayer();
        if (!ownedPlayers.includes(drawnPlayer)) {
            ownedPlayers.push(drawnPlayer);  // 새로운 선수를 보유 선수 목록에 추가
        }
    }
=======
    updateGold();

    let newPlayers = [];

    for (let i = 0; i < numDraws; i++) {
        const drawnPlayer = drawPlayer();
        newPlayers.push(drawnPlayer);
    }

    // 가챠 결과를 서버에 전달하여 보유 선수 목록 업데이트
    await fetch('/players/updateOwnedPlayers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPlayers }),
    });
>>>>>>> Stashed changes
}

// 1장 가챠 버튼
document.getElementById('singleGachaBtn').addEventListener('click', () => {
<<<<<<< Updated upstream
    performGacha(1);
=======
    setGacha(1);
>>>>>>> Stashed changes
});

// 10장 가챠 버튼
document.getElementById('multiGachaBtn').addEventListener('click', () => {
<<<<<<< Updated upstream
    performGacha(10);
=======
    setGacha(10);
>>>>>>> Stashed changes
});

// 페이지 로드 시 초기 선수 목록과 골드 상태 표시
window.onload = () => {
    playerList();
<<<<<<< Updated upstream
    updateGoldDisplay();
=======
    updateGold();
>>>>>>> Stashed changes
};