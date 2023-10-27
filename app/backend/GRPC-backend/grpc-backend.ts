import Backend, { ServerMessageToSlaveHandler } from "../backend";
import { BotChatClient } from "./grpc/proto/model_grpc_pb";
import { Message } from "./grpc/proto/model_pb";
import grpcOptions from "./config";

export default class GRPCBackend extends BotChatClient implements Backend {

    stream;
    toSlaveHandlers: ServerMessageToSlaveHandler[];

    constructor(grpc: grpcOptions) {
        const { address, credentials, options } = grpc
        super(address, credentials, options);

        this.stream = this.startChatVK();
        this.toSlaveHandlers = [];

        this.stream.on('data', (data) => {
            const text = data.array[0] as string;
            const internal_chat_id = data.array[1] as number;
            this.resendFromServerToSlave(internal_chat_id, text);
        });

        this.stream.on('end', () => {
            console.log('connection down\nNeed restart');
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

        console.log('GRPC sending ', text);
        return new Promise(() => {
            this.stream.write(msg, (e: any) => {
                console.log(`\tgrpc done. [${text}}]. Error is `, e);
                if (!e) {
                    return true;
                }
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
