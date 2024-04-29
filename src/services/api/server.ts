import polka from 'polka';
import cors from 'cors';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import userRoutes from './routes/userRoutes';
import reclamosRoutes from './routes/reclamosRoutes';
import conversacionesRouter from './routes/conversacionesRoutes';
import visitasFlowRouter from './routes/visitasFlujoRoutes';
import pdfRoutes from './routes/pdfRoutes';
import path from 'path';
import { DataSource } from 'typeorm'
import { Contact } from './entities/Contact';
import { Reclamo } from './entities/Reclamo';
import { Converstation } from './entities/Conversation';
import { Flow } from './entities/Flow';
import { History } from './entities/History';
import { User } from './entities/User';

export const pgDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "39660037",
  database: "ceresitodb_ts",
  synchronize: true,
  entities: [Contact, Converstation, Flow, History, Reclamo, User],
  migrations: [/*...*/],
  migrationsTableName: "custom_migration_table",
});
// Resto de tu código...

const app = polka();
const PORT = process.env.PORT || 3000;
const DataPg = pgDataSource;
app.use(cors());
app.use(polka.json());

// Rutas
app.use('/api', userRoutes, pdfRoutes, reclamosRoutes, conversacionesRouter, visitasFlowRouter);
app.use('/modified_certificates', polka.static(path.join(__dirname, 'modified_certificates')));

export const startServer = (port: number) => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  DataPg.initialize();
};