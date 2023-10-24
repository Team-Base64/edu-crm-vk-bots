import { NextMiddleware } from "middleware-io";
import { ContextDefaultState, IMessageContextSendOptions, MessageContext } from "vk-io";

export const customSceneMiddleware = (context: MessageContext<ContextDefaultState>, next: NextMiddleware) => {
    if (!context.scene.current) {
        return next();
    }

    if (context.scene.canceled) {
        return context.scene.leave({
            canceled: true
        });
    }

    return context.scene.reenter();
}

interface LeaveHandlerProps {
    msgDone?: IMessageContextSendOptions;
    msgCancel?: IMessageContextSendOptions;
}

export const leaveHandlerCustom = ({ msgDone, msgCancel }: LeaveHandlerProps) => {
    return (context: MessageContext<ContextDefaultState>) => {
        if (context.scene.canceled && msgCancel) {
            return context.send(msgCancel);
        }

        if (msgDone) {
            return context.send(msgDone);
        }

        return;
    }
}