/**
 * Configuration interface for MedusaStore library
 */
export interface MedusaStoreConfig {
  /**
   * Base URL for the Medusa API
   */
  apiBaseUrl?: string;

  /**
   * Publishable API key for Medusa
   */
  publishableKey?: string;

  /**
   * Default region/country code
   */
  defaultCountryCode?: string;

  /**
   * Enable development mode features
   */
  developmentMode?: boolean;

  /**
   * Enable NGXS logger plugin
   */
  enableLogging?: boolean;

  /**
   * Enable NGXS storage plugin
   */
  enableStorage?: boolean;

  /**
   * Storage keys to persist in localStorage
   */
  storageKeys?: string[];

  /**
   * Custom error handler
   */
  errorHandler?: (error: any) => void;
}

/**
 * Default configuration values
 */
export const DEFAULT_MEDUSA_STORE_CONFIG: Partial<MedusaStoreConfig> = {
  defaultCountryCode: 'us',
  developmentMode: false,
  enableLogging: false,
  enableStorage: true,
  storageKeys: ['auth', 'regions', 'medusaCart'],
};
