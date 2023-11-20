import express from 'express';
import cors from 'cors';
import { PORT } from '../server/config.js';
import indexRoutes from './routes/index.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

const app = express();

// Opciones de CORS
const corsOptions = {
  origin: 'http://localhost:5173', 
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};


app.use(cors(corsOptions));


app.use(express.json());


app.use(indexRoutes);
app.use(tasksRoutes);


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;