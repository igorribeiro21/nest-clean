import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const editQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    attachments: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller('/questions')
export class EditQuestionController {
    constructor(
        private editQuestion: EditQuestionUseCase
    ) { }

    @Put('/:id')
    @HttpCode(204)    
    async handle(
        @Body(bodyValidationPipe) body: EditQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string    
    ) {
        const { title, content, attachments } = body;
        const { sub: userId } = user;

        const { isLeft } = await this.editQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: attachments,
            questionId
        });

        if (isLeft()) {
            throw new BadRequestException();
        }
    }
}