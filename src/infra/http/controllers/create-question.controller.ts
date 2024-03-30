import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
export class CreateQuestionController {
    constructor(
        private createQuestion: CreateQuestionUseCase
    ) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload) {
        const { title, content } = body;
        const { sub: userId } = user;

        const { isLeft } = await this.createQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: []
        });

        if (isLeft()) {
            throw new BadRequestException();
        }
    }
}