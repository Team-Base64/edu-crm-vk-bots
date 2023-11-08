import mime from "mime";
import { Attachment, AttachmentType, ExternalAttachment } from "vk-io";
import { changeHttpsToHttp } from "./changeHttpsToHttp";
import Backend from "../backend/backend";
import logger from "./logger";

interface ParsedAttachment {
    url: string,
    mimetype: string,
};

const parserLogger = logger.child({}, {
    msgPrefix: 'AttachParser: ',
});

const uploaderLogger = logger.child({}, {
    msgPrefix: 'AttachUploader: ',
});

export const parseAttachments = (attachments: (Attachment<{}, string> | ExternalAttachment<{}, string>)[]): ParsedAttachment[] => {
    const parsedAttachments: ParsedAttachment[] = [];
    // для каждого вложения
    for (let attach of attachments) {
        const attachJson = attach.toJSON() as any;

        switch (attach.type) {
            // Документ
            case AttachmentType.DOCUMENT: {
                // url
                const { url, extension }: { url: string, extension: string } = attachJson;

                // mimetype
                const mimetype = mime.getType(extension);
                if (!mimetype) {
                    parserLogger.debug({ extension }, 'Не удалось получить mimetype');
                    break;
                }
                parserLogger.debug({mimetype}, 'Получил документ');

                parsedAttachments.push({
                    url: changeHttpsToHttp(url),
                    mimetype: mimetype,
                });

                break;
            }

            // ФОто
            case AttachmentType.PHOTO: {
                // Получаем url
                const fullURL: string = attachJson.largeSizeUrl;
                if (!fullURL) {
                    parserLogger.debug('Не получил URL картинки');
                    break;
                }
                // mimetype
                const mimetype = mime.getType(
                    fullURL
                        .slice(
                            0,
                            fullURL.indexOf('?')
                        )
                );

                if (!mimetype) {
                    parserLogger.debug('Не удалось получить mimetype');
                    break;
                }

                parserLogger.debug({mimetype}, 'Получил фотографию');
                parsedAttachments.push({
                    url: changeHttpsToHttp(fullURL),
                    mimetype: mimetype,
                });

                break;
            }

            default: {
                parserLogger.debug({ type: attach.type }, 'Неизвестный тип аттача');
                break;
            }
        }
    }

    return parsedAttachments;
}

export const uploadAttachments = async (parsedAttachments: ParsedAttachment[], backend: Backend): Promise<string[]> => {
    const internal_urls: string[] = [];

    for (let a of parsedAttachments) {
        // Загружаем на бэк
        const { internalFileURL, ...uploadFileError } =
            await backend.uploadAttachment({
                fileURL: a.url,
                mimetype: a.mimetype,
            });

        if (uploadFileError.isError) {
            uploaderLogger.warn({ msg: uploadFileError.error }, 'Не удалось загрузить вложение');
            continue;
        }

        internal_urls.push(internalFileURL);
    }

    return internal_urls;
}