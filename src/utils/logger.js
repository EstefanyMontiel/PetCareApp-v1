/**
 * Logger utility - Controls console output based on environment
 * Only shows logs in development mode to improve production performance
 */

const isDevelopment = __DEV__;

export const logger = {
    /**
     * Log general messages (development only)
     */
    log: (...args) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    /**
     * Log errors (always visible for debugging)
     */
    error: (...args) => {
        console.error(...args);
    },

    /**
     * Log warnings (development only)
     */
    warn: (...args) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },

    /**
     * Log info messages (development only)
     */
    info: (...args) => {
        if (isDevelopment) {
            console.info(...args);
        }
    },

    /**
     * Log debug messages (development only)
     */
    debug: (...args) => {
        if (isDevelopment) {
            console.debug(...args);
        }
    },
};

export default logger;
