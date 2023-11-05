import serverless from 'serverless-http';
import app from './server/index.js';  // Asegúrate de que el camino es correcto

export const handler = serverless(app);