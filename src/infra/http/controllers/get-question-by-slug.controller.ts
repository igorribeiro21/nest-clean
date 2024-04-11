import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { QuestionPresenter } from '../presenters/question-presenter';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
    constructor(
        private getQuestionBySlug: GetQuestionBySlugUseCase
    ) { }

    @Get()
    async handle(
        @Param('slug') slug: string
    ) {
        const { isLeft, value } = await this.getQuestionBySlug.execute({
            slug
        });

        if (isLeft()) {
            throw new BadRequestException();
        }

        if(value instanceof ResourceNotFoundError) {
            throw new ResourceNotFoundError();
        }

        const { question } = value;

        return { question: QuestionPresenter.toHTTP(question) };
    }


}