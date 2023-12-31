export type ServerMessageToSlaveHandler = (payload: MessagePayload) => Promise<any>;

export type BackendError = {
    isError?: boolean;
    error?: string;
};

export type MessagePayload = {
    internal_chat_id: number;
    text: string;
    attachmentURLs: string[];
};

export type TaskPayload = {
    description: string;
    attachmentURLs: string[];
};

export type HomeworkPayload = {
    homework_id: number;
    title: string;
    description: string;
    createDateISO: string;
    deadlineDateISO: string;
    tasks: TaskPayload[];
};

export type SolutionPayload = {
    text: string;
    attachmentURLs: string[];
};

export type EventPayload = {
    uuid: string;
    title: string;
    description: string;
    startDateISO: string;
    endDateISO: string;
};

// Requests
export type ValidateTokenPayload = {
    token: string;
};

export type SocialNetworkType = 'tg' | 'vk';

export type CreateStudentPayload = {
    name: string;
    type: SocialNetworkType;
    avatarURL: string;
};

export type CreateChatPayload = {
    student_id: number;
    class_id: number;
};

export type GetHomeworksPayload = {
    class_id: number;
};

export type SendSolutionPayload = {
    student_id: number;
    homework_id: number;
    solution: SolutionPayload;
};

export type FileUploadPayload = {
    mimetype: string;
    fileURL: string;
};

export type GetEventsPayload = {
    classID: number;
};

// Responses

export interface ValidateTokenResult extends BackendError {
    class_id: number;
}

export interface CreateStudentResult extends BackendError {
    student_id: number;
}

export interface CreateChatResult extends BackendError {
    internal_chat_id: number;
}

export interface GetHomeworksResult extends BackendError {
    homeworks: HomeworkPayload[];
}

export interface SendSolutionResult extends BackendError {

}

export interface FileUploadResult extends BackendError {
    internalFileURL: string;
}

export interface GetEventsResult extends BackendError {
    events: EventPayload[];
}
