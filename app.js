import express from 'express';
import LogMiddleware from './middlewares/log.middleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(LogMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
