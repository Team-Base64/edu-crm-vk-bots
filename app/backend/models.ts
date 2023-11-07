export type ServerMessageToSlaveHandler = (internal_chat_id: number, text: string) => Promise<any>;

export type BackendError = {
    isError ?: boolean;
    error ?: string;
}

export type Message = {
    internal_chat_id: number;
    text: string;
    attachmentURLs: string[];
};

export type HomeworkData = {
    homework_id: number;
    title: string;
    description: string;
    attachmentURLs: string[];
};

export type SolutionData = {
    text: string;
    attachmentURLs: string[];
};

// Requests
export type ValidateTokenRequest = {
    token: string;
};

export type SocialNetworkType = 'tg' | 'vk';

export type CreateStudentRequest = {
    name: string;
    type: SocialNetworkType;
};

export type CreateChatRequest = {
    student_id: number;
    class_id: number;
}

export type GetHomeworksRequest = {
    class_id: number;
}

export type SendSolutionRequest = {
    student_id : number;
    homework_id: number;
    solution: SolutionData;
}

export type FileUploadRequest = {
    mimetype: string;
    fileURL: string;
}

// Responses

export interface ValidateTokenResponse extends BackendError {
    class_id: number;
}

export interface CreateStudentResponse extends BackendError {
    student_id: number;
}

export interface CreateChatResponse extends BackendError {
    internal_chat_id: number;
}

export interface GetHomeworksResponse extends BackendError {
    homeworks: HomeworkData[];
}

export interface SendSolutionResponse extends BackendError {

}

export interface FileUploadResponse extends BackendError {
    internalFileURL: string;
}
