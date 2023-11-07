import mime from "mime";
import { Attachment, AttachmentType, ExternalAttachment } from "vk-io";
import { changeHttpsToHttp } from "./changeHttpsToHttp";
import Backend from "../backend/backend";

interface ParsedAttachment {
    url: string,
    mimetype: string,
};

export const parseAttachments = (attachments: (Attachment<{}, string> | ExternalAttachment<{}, string>)[]): ParsedAttachment[] => {
    const parsedAttachments: ParsedAttachment[] = [];
    // для каждого вложения
    for (let attach of attachments) {
        const attachJson = attach.toJSON() as any;

        // Если документ
        if (attach.type === AttachmentType.DOCUMENT) {
            // url
            const { url, extension }: { url: string, extension: string } = attachJson;

            // mimetype
            const mimetype = mime.getType(extension);
            if (!mimetype) continue;


            parsedAttachments.push({
                url: changeHttpsToHttp(url),
                mimetype: mimetype,
            });

            continue;
        }

        // Если фото
        if (attach.type === AttachmentType.PHOTO) {
            // Получаем url
            const fullURL: string = attachJson.largeSizeUrl;
            if (!fullURL) continue;

            // mimetype
            const mimetype = mime.getType(
                fullURL
                    .slice(
                        0,
                        fullURL.indexOf('?')
                    )
            );

            if (!mimetype) continue;

            parsedAttachments.push({
                url: changeHttpsToHttp(fullURL),
                mimetype: mimetype,
            });

            continue;
        }
    }

    return parsedAttachments;
}

export const uploadAttachments = async (parsedAttachments: ParsedAttachment[], backend: Backend): Promise<string[]> => {
    const internal_urls : string[] = [];

    for (let a of parsedAttachments) {
        // Загружаем на бэк
        const { internalFileURL, ...uploadFileError } =
            await backend.uploadAttachment({
                fileURL: a.url,
                mimetype: a.mimetype,
            });

        if (uploadFileError.isError) {
            continue;
        }

        internal_urls.push(internalFileURL);
    }

    return internal_urls;
}