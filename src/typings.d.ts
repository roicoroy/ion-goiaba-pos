declare namespace NodeJS {
  interface ProcessEnv {
    MEDUSA_API_BASE_PATH: string;
    MEDUSA_PUBLISHABLE_KEY: string;
    MEDUSA_BACKEND_URL: string;
    STRIPE_PUBLISHABLE_KEY: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};