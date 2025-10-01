import * as process from 'node:process';


export const configTaskApp = () => ({
  database: {
    port: process.env.PORT ?? 3000,
  }
})