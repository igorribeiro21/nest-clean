import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import { z } from 'zod';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';
import { AnswerPresenter } from '../presenters/answer-presenter';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
  
const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));
  
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
  
  type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
  
  @Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
    constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}
  
    @Get()
    async handle(
      @Query('page', queryValidationPipe) page: PageQueryParamSchema,
      @Param('questionId') questionId: string,
    ) {
        const { isLeft, value } = await this.fetchQuestionAnswers.execute({
            page,
            questionId,
        });
  
        if (isLeft()) {
            throw new BadRequestException();
        }

        if(!value?.answers) {
            throw new BadRequestException();
        }

  
        const answers = value.answers;
  
        return { answers: answers.map(AnswerPresenter.toHTTP) };
    }
}