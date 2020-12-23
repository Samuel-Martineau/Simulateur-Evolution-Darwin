declare global {
  namespace NodeJS {
    interface Process {
      browser: boolean;
    }
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development';
    }
  }
}

export {};
