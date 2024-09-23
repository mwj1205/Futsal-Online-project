import express from 'express';
import LogMiddleware from './middlewares/log.middleware.js';
import userRouter from './routes/user.router.js';
import playRouter from './routes/play.router.js';
import rankingRouter from './routes/userRanking.router.js';
import inquiryRouter from './routes/inquiry.router.js';
import playerRouter from './routes/player.router.js';
import SupportRouter from './routes/support.router.js';
import ErrorHandlerMiddleware from './middlewares/error-handler.middleware.js';
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(LogMiddleware);
app.use('/api', [
  userRouter,
  playRouter,
  inquiryRouter,
  rankingRouter,
  playerRouter,
  SupportRouter,
]);

app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
