import Backend, { ServerMessageToSlaveHandler } from "../backend";
import { BotChatClient } from "./grpc/proto/model_grpc_pb";
import { Message } from "./grpc/proto/model_pb";
import grpcOptions from "./config";
import logger from "../../helpers/logger";

const backendLogger = logger.child({ class: 'GRPCbackend' });

export default class GRPCBackend extends BotChatClient implements Backend {

    stream;
    toSlaveHandlers: ServerMessageToSlaveHandler[];

    constructor(grpc: grpcOptions) {
        const { address, credentials, options } = grpc
        super(address, credentials, options);

        this.stream = this.startChatVK();
        this.toSlaveHandlers = [];

        this.stream.on('data', (data) => {

            try {
                const text = data.array[0] as string;
                const internal_chat_id = data.array[1] as number;
                backendLogger.debug({ text, internal_chat_id }, 'Get message from remote backend');
                this.resendFromServerToSlave(internal_chat_id, text);
            }
            catch (e) {
                backendLogger.warn(e, 'Cant parse message from remote backend');
            }
        });

        this.stream.on('end', () => {
            backendLogger.info('GRPC connection closed. Need restart');
            process.exit(0);
        });
    }

    public validateInviteToken(token: string): Promise<number | undefined> {

        // TODO !!!
        if (token === '123') {
            return Promise.resolve(Date.now()); // Expires mock
        }

        return Promise.resolve(undefined);
    }

    public createChat(): Promise<number | undefined> {
        // TODO!!!
        return Promise.resolve(2);
    }

    public resendMessageFromClient(internal_chat_id: number, text: string): Promise<boolean> {
        const msg = new Message();
        msg.setChatid(internal_chat_id);
        msg.setText(text);

        backendLogger.debug({ text, internal_chat_id }, 'Sending msg to remote backend');
        return new Promise(() => {
            this.stream.write(msg, (e: any) => {
                if (!e) {
                    backendLogger.warn({ text, internal_chat_id, e }, 'Message sent error');

                    return true;
                }
                
                backendLogger.debug({ text, internal_chat_id }, 'Message sent success');

                return false;
            });
        })
    }

    public resendFromServerToSlave(internal_chat_id: number, text: string): void {
        this.toSlaveHandlers.forEach(h => h(internal_chat_id, text));
    }

    public addHandleMessageFromServerToSlave(handler: ServerMessageToSlaveHandler): void {
        this.toSlaveHandlers.push(handler);
    }
}
