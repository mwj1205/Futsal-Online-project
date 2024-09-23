import express from 'express';
<<<<<<< Updated upstream
import {prisma} from '../utils/prisma/prismaClient.js';

const router = express.Router();

const allPlayer = {
    //전체 선수 목록 (작성해야됨)
}

const ownPlayers = {
    //보유 선수 목록 (작성해야됨)
}

function setPlayerStyle(playerElement, isOwned) {
    if (isOwned) {
        // 보유한 선수는 흰색
        playerElement.style.color = 'white';  
    } else {
        // 보유하지 않은 선수는 회색
        playerElement.style.color = 'gray';    
=======
import { prisma } from '../utils/prisma/prismaClient.js';

const router = express.Router();

export let allPlayers = [
    // 작성해야됨
];

let ownedPlayers = [];

// 보유 선수 목록을 업데이트
router.post('/updateOwnedPlayers', (req, res) => {
    const { newPlayers } = req.body;

    // 새롭게 얻은 선수들을 보유 선수 목록에 추가
    newPlayers.forEach(player => {
        if (!ownedPlayers.includes(player)) {
            ownedPlayers.push(player);
        }
    });

    // 업데이트 후 성공 응답 전송
    res.json({ success: true, ownedPlayers });
});

// 클라이언트가 선수 데이터를 불러갈 수 있도록 제공하는 엔드포인트
router.get('/players', (req, res) => {
    res.json({
        allPlayers,
        ownedPlayers,
    });
});
function setPlayerStyle(playerElement, isOwned) {
    if (isOwned) {
        // 보유한 선수는 흰색
        playerElement.style.color = 'white';
    } else {
        // 보유하지 않은 선수는 회색
        playerElement.style.color = 'gray';
>>>>>>> Stashed changes
    }
}

function playerList() {
    const ownedList = document.getElementById('ownedPlayers');
    const notOwnedList = document.getElementById('notOwnedPlayers');

<<<<<<< Updated upstream
    allPlayer.array.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;

        if (ownPlayers.include(player)) {
            //보유한 선수 스타일 적용
            setPlayerStyle(listItem, true); 
=======
    allPlayers.array.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;

        if (ownPlayers.includes(player)) {
            //보유한 선수 스타일 적용
            setPlayerStyle(listItem, true);
>>>>>>> Stashed changes
            ownedList.appendChild(listItem);
        } else {
            //보유하지 않은 선수 스타일 적용
            setPlayerStyle(listItem, false);
            notOwnedList.appendChild(listItem);
        }
    });
};

<<<<<<< Updated upstream
// 로드 시 선수 목록 확인 (임시 설정)
window.onload = playerList;
=======
// 서버에서 데이터 로드 후 반영
async function loadPlayerData() {
    const response = await fetch('/players');
    const data = await response.json();
    playerList(data.allPlayers, data.ownedPlayers);
}

// 페이지 로드 시 초기 선수 목록 표시
window.onload = () => {
    loadPlayerData();
};

export default router;
>>>>>>> Stashed changes
