export type ServerMessageToSlaveHandler = (internal_chat_id: number, text: string) => Promise<any>;

export type BackendError = {
    message ?: string;
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
    homework_id: number;
    solution: SolutionData;
}

export type FileUploadRequest = {
    mimetype: string;
    fileURL: string;
}

// Responses

export type ValidateTokenResponse = {
    class_id: number;
}

export type CreateStudentResponse = {
    student_id: number;
}

export type CreateChatResponse = {
    internal_chat_id: number;
}

export type GetHomeworksResponse = {
    homeworks: HomeworkData[];
}

export type SendSolutionResponse = {

}

export type FileUploadResponse = {
    internalFileURL: string;
}
