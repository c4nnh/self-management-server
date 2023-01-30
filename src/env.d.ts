declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_ACCESS_EXPIRED: string;
      JWT_REFRESH_EXPIRED: string;
    }
  }
}

export {};
