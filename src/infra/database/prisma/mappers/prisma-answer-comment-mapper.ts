import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Coment as PrismaComment, Prisma} from '@prisma/client';

export class PrismaAnswerCommentMapper {
    static toDomain(raw: PrismaComment ): AnswerComment {
        if(!raw.answerId) {
            throw new Error('Invalid comment type');
        }

        return AnswerComment.create({
            content: raw.content,
            authorId: new UniqueEntityID(raw.authorId),
            answerId: new UniqueEntityID(raw.answerId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id));
    }

    static toPrisma(answercomment: AnswerComment): Prisma.ComentUncheckedCreateInput {
        return {
            id: answercomment.id.toString(),
            authorId: answercomment.authorId.toString(),
            answerId: answercomment.answerId.toString(),
            content: answercomment.content,
            createdAt: answercomment.createdAt,
            updatedAt: answercomment.updatedAt
        };
    }
}