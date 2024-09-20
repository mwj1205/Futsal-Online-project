import express from 'express';
import LogMiddleware from './middlewares/log.middleware.js';
import playRouter from './routes/play.router.js';
import rankingRouter from './routes/userRanking.router.js';
import ErrorHandlerMiddleware from './middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(LogMiddleware);
app.use('/api', [playRouter, rankingRouter]);

app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
