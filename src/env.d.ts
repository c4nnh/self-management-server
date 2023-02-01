declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_ACCESS_EXPIRED: string;
      JWT_REFRESH_EXPIRED: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_BUCKET_NAME: string;
    }
  }
}

export {};
