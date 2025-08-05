import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
export const db = drizzle(process.env.DATABASE_URL!); //inicializa o drizzle com a URL do banco de dados
