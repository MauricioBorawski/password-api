import express from 'express';
import userRoutes from './routes/users-routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
