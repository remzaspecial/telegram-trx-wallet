import winston from 'winston';
const { printf } = winston.format;

export default function getLogger (filename : string) {
    const appStatus = process.env.NODE_ENV;;

    const myFormat = printf((info) => {
        if (info.message.constructor === Object) {
            info.message = JSON.stringify(info.message, null, 4);
        }
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    });

    return winston.createLogger({
        format: winston.format.combine(
            winston.format.label({ label: filename }),
            winston.format.colorize(),
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.prettyPrint(),
            myFormat
        ),
        transports: [new winston.transports.Console({
            level: (appStatus === 'DEV' || appStatus === 'UNITTEST') ? 'debug' : 'info'
        })]
    });
};