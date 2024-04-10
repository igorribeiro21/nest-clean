import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type-error';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';
import {
    BadRequestException,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/attachments')
export class UploadAttachmentController {
    constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
    ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
    async handle(
    @UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 1024 * 1024 * 2, // 2mb
                }),
                new FileTypeValidator({
                    fileType: '.(png|jpg|jpeg|pdf)',
                }),
            ],
        }),
    )
        file: Express.Multer.File,
    ) {
        const { isLeft, value } = await this.uploadAndCreateAttachment.execute({
            fileName: file.originalname,
            fileType: file.mimetype,
            body: file.buffer,
        });

        if (isLeft()) {
            let error = value;

            switch (error.constructor) {
            case InvalidAttachmentTypeError:
                if(value instanceof InvalidAttachmentTypeError) {
                    error = value;
                    throw new BadRequestException(error.message);
                }
                break;
            default:
                if(value instanceof Error) {
                    error = value;
                    throw new BadRequestException(error.message);
                }
            }
        }

        if(value instanceof InvalidAttachmentTypeError) {
            throw new BadRequestException(value.message);
        }

        const { attachment } = value;

        return {
            attachmentId: attachment.id.toString(),
        };
    }
}