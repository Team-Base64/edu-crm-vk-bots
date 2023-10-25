import Backend, {HMFS} from "../backend";
import { BotChatClient } from "./grpc/proto/model_grpc_pb";
import grpc from '@grpc/grpc-js';
import { Message } from "./grpc/proto/model_pb";

interface grpcOptions {
    address: string;
    credentials: grpc.ChannelCredentials;
    options?: any;
}


export default class GRPCBackend extends BotChatClient implements Backend {

    stream;
    handleMessageFromServer: HMFS | undefined;
    constructor(grpc: grpcOptions) {
        const { address, credentials, options } = grpc
        super(address, credentials, options);

        this.stream = this.startChatVK();
        this.handleMessageFromServer = undefined;

        this.stream.on('data', (data) => {
            const text = data.array[0];
            const internal_chat_id = data.array[1];
            if (this.handleMessageFromServer) {
                this.handleMessageFromServer(internal_chat_id, text);
            }
        });
    }

    public addHandle(handler : HMFS) {
        this.handleMessageFromServer = handler;
    } 

    public validateInviteToken(token: string): Promise<number | undefined> {

        // TODO !!!
        if (token === '123') {
            return Promise.resolve(Date.now()); // Expires mock
        }

        return Promise.resolve(undefined);
    }

    public createChat(): Promise<number | undefined> {
        throw new Error("Method not implemented.");
    }

    public resendMessageFromClient(internal_chat_id: number, text: string): Promise<boolean> {
        const msg = new Message();
        msg.setChatid(internal_chat_id);
        msg.setText(text);

        return new Promise(() => {

            this.stream.write(msg, (e: any) => {
                if (!e) {
                    return true;
                }
                return false;
            });
        })
    }

    public resendMessageFromServer(internal_chat_id: number, text: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}