import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerAttachmenttMapper } from '../mappers/prisma-answer-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
    constructor(private prisma:PrismaService) {}

    async findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]> {
        const answerAttachments = await this.prisma.attachment.findMany({
            where: {
                questionId
            }
        });

        return answerAttachments.map(PrismaAnswerAttachmenttMapper.toDomain);
    }
    async deleteManyByAnswerId(questionId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: {
                questionId
            }
        });
    }
    
}