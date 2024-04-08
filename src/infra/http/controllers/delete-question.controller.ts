import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';

@Controller('/questions')
export class DeleteQuestionController {
    constructor(
        private deleteQuestion: DeleteQuestionUseCase
    ) { }

    @Delete('/:id')
    @HttpCode(204)    
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string    
    ) {
        const { sub: userId } = user;

        const { isLeft } = await this.deleteQuestion.execute({
            questionId,
            authorId: userId
        });

        if (isLeft()) {
            throw new BadRequestException();
        }
    }
}