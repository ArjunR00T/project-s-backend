import { createLogger, format, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import path from 'path'; // Add this line to import the path module

// Ensure logs directory exists
const logDir = 'logs';
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

// Optional: Set this in your environment, or fallback
const serviceName = process.env.SERVICE_NAME || 'unknown-service';

const logger = createLogger({
  level: 'info', // Set to 'debug' if needed during development
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: serviceName },
    transports: [
        // Colorized console output (human-readable)
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ level, message, timestamp, stack }) => {
              return stack
                ? `[${timestamp}] ${level}: ${message}\n${stack}`
                : `[${timestamp}] ${level}: ${message}`;
            })
          )
        }),
      
        // File: all logs in JSON
        new transports.File({
          filename: path.join(logDir, 'combined.log'),
          format: format.combine(format.timestamp(), format.json())
        }),
      
        // File: errors only
        new transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error',
          format: format.combine(format.timestamp(), format.json())
        })  
    ],
});

export default logger;
