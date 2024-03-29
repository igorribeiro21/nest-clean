import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answers-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

@Module({
    providers: [
        PrismaService,
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentsRepository,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository
        },
        PrismaAnswerAttachmentsRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerRepository
    ],
    exports: [
        PrismaService,
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentsRepository,
        QuestionsRepository,
        PrismaAnswerAttachmentsRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerRepository
    ],
})
export class DatabaseModule {}