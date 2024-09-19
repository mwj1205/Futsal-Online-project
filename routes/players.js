import express from 'express';
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
    }
}

function playerList() {
    const ownedList = document.getElementById('ownedPlayers');
    const notOwnedList = document.getElementById('notOwnedPlayers');

    allPlayer.array.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;

        if (ownPlayers.include(player)) {
            //보유한 선수 스타일 적용
            setPlayerStyle(listItem, true); 
            ownedList.appendChild(listItem);
        } else {
            //보유하지 않은 선수 스타일 적용
            setPlayerStyle(listItem, false);
            notOwnedList.appendChild(listItem);
        }
    });
};

// 로드 시 선수 목록 확인 (임시 설정)
window.onload = playerList;