const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 스쿼드 조회 함수
async function getUserSquad(userId) {
  try {
    // userId로 유저와 스쿼드 정보 조회
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(userId),
      },
      include: {
        squad: {
          include: {
            player1: true,
            player2: true,
            player3: true,
          },
        },
      },
    });

    // 정보 없을 경우 처리
    if (!user || !user.squad) {
      console.log('유저 또는 스쿼드를 찾을 수 없습니다.');
      return null;
    }

    // 스쿼드 정보 반환
    const squadPlayers = [
      { id: user.squad.player1?.id, name: user.squad.player1?.playername },
      { id: user.squad.player2?.id, name: user.squad.player2?.playername },
      { id: user.squad.player3?.id, name: user.squad.player3?.playername },
    ];

    console.log({ players: squadPlayers });
    return squadPlayers;
  } catch (error) {
    console.error('오류가 발생했습니다:', error);
    return null;
  }
}
