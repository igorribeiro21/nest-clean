import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import { z } from 'zod';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
  
const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));
  
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
  
  type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
  
  @Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
    constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}
  
    @Get()
    async handle(
      @Query('page', queryValidationPipe) page: PageQueryParamSchema,
      @Param('questionId') questionId: string,
    ) {
        const { isLeft, value } = await this.fetchQuestionComments.execute({
            page,
            questionId,
        });
  
        if (isLeft()) {
            throw new BadRequestException();
        }

        if(!value?.comments) {
            throw new BadRequestException();
        }
  
        const comments = value.comments;
  
        return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
    }
}