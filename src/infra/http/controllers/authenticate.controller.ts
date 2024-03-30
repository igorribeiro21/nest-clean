import { BadRequestException, UnauthorizedException, UsePipes } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';

const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
@Public()
export class AuthenticateController {
    constructor(
        private authenticateStudent: AuthenticateStudentUseCase,
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body;

        const { isLeft, value } = await this.authenticateStudent.execute({
            email,
            password
        });

        if (isLeft()) {
            const error = value;

            switch (error.constructor) {
            case WrongCredentialsError: 
                if(error instanceof WrongCredentialsError) {
                    throw new UnauthorizedException(error.message);
                }
                break;
            default: 
                if(error instanceof Error) {
                    throw new BadRequestException(error.message);
                }
            }
        }

        if (value instanceof WrongCredentialsError) {
            throw new WrongCredentialsError();
        }

        const { accessToken } = value;

        return {
            access_token: accessToken,
        };
    }
}