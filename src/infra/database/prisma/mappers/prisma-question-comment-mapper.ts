import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Coment as PrismaComment, Prisma} from '@prisma/client';

export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaComment ): QuestionComment {
        if(!raw.questionId) {
            throw new Error('Invalid comment type');
        }

        return QuestionComment.create({
            content: raw.content,
            authorId: new UniqueEntityID(raw.authorId),
            questionId: new UniqueEntityID(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id));
    }

    static toPrisma(questioncomment: QuestionComment): Prisma.ComentUncheckedCreateInput {
        return {
            id: questioncomment.id.toString(),
            authorId: questioncomment.authorId.toString(),
            questionId: questioncomment.questionId.toString(),
            content: questioncomment.content,
            createdAt: questioncomment.createdAt,
            updatedAt: questioncomment.updatedAt
        };
    }
}