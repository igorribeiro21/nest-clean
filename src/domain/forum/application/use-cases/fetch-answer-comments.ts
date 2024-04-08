import { Either, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comment-repository';
import { Injectable } from '@nestjs/common';

interface FetchAnswerCommentsUseCaseRequest {
	page: number;
    answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<null,{
	answerComments: AnswerComment[]
}>

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(
		private answerCommmentsRepository: AnswerCommentsRepository
    ) { }

    async execute({
        page,
        answerId
    }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
        const answerComments = await this.answerCommmentsRepository.findManyByAnswerId(answerId , { page });

        return right({
            answerComments
        });
    }
}