declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRODUCT_NAME: string;
      PRODUCT_VERSION: string;
      PRODUCT_PLATFORM: string;
    }
  }
}

export {};
