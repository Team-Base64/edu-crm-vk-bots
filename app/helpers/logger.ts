import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino({
    level: process.env.LOGLEVEL || 'debug',
}, pretty({
    colorize: process.env.LOGDIR ? false : true,
    levelFirst: true,
    destination: process.env.LOGDIR ? process.env.LOGDIR + `app_${Date.now()}.log` : 1,
    mkdir: true,
}));

export default logger;