import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import { z } from 'zod';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { CommentPresenter } from '../presenters/comment-presenter';
import { ZodValidationPipe } from '../pipes/zod-validation';

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
    constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('answerId') answerId: string,
    ) {
        const { isLeft, value } = await this.fetchAnswerComments.execute({
            page,
            answerId,
        });

        if (isLeft()) {
            throw new BadRequestException();
        }

        if(!value?.answerComments) {
            throw new BadRequestException();
        }

        const answerComments = value.answerComments;

        return { comments: answerComments.map(CommentPresenter.toHTTP) };
    }
}