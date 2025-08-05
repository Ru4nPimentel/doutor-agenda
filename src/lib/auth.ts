import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle"; //adapta o drizzle para funcionar com o better-auth

export const auth = betterAuth({
  // Configuração do Better Auth
  database: drizzleAdapter(db, {
    provider: "pg", // Define o provedor do banco de dados como PostgreSQL
  }),
});
