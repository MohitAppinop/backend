import { LoggerService } from '@nestjs/common';
import winston from 'winston';
import getconfig from '../config/configuration';

const environment = getconfig();
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const level = () => {
    const env = environment;
    const isDevelopment = env
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

const mydate = new Date();
const newFilename =
    mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate();

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }),
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({
        handleExceptions: true,
        filename: `./logs/${newFilename}.log`
    })
];

export class WinstonLogger implements LoggerService {
    private readonly logger = winston.createLogger({
        level: level(),
        levels,
        format,
        transports
    });

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace: string) {
        this.logger.error(message, trace);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.verbose(message);
    }
}
