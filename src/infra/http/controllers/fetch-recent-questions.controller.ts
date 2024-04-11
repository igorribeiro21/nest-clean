import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(
        z.number().min(1)
    );

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
export class FetchRecentQuestionsController {
    constructor(
        private fetchRecentQuestions: FetchRecentQuestionsUseCase
    ) { }

    @Get()
    async handle(
        @Query('page',queryValidationPipe) page: PageQueryParamSchema
    ) {
        const { isLeft, value } = await this.fetchRecentQuestions.execute({
            page
        });

        if (isLeft()) {
            throw new BadRequestException();
        }

        const questions = value?.questions;

        if(!questions) {
            throw new Error();
        }

        return {
            questions: questions.map(QuestionPresenter.toHTTP)
        };
    }


}