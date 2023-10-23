
export const gracefulStop = (handler: Function) => {
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM', 'exit'
    ].forEach(signal => {
        process.on(signal, async () => {
            await handler();
            process.exit();
        });
    });
}
