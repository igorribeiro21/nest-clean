import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';

let inMemoryAnwersRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments', () => {
    beforeEach(() => {
        inMemoryAnwersRepository = new InMemoryQuestionCommentsRepository();
        sut = new FetchQuestionCommentsUseCase(inMemoryAnwersRepository);
    });

    it('should be able to fetch question comments', async () => {
        await inMemoryAnwersRepository.create(makeQuestionComment({
            questionId: new UniqueEntityID('question-1')
        }));
        await inMemoryAnwersRepository.create(makeQuestionComment({
            questionId: new UniqueEntityID('question-1')
        }));
        await inMemoryAnwersRepository.create(makeQuestionComment({
            questionId: new UniqueEntityID('question-1')
        }));

        const result = await sut.execute({
            page: 1,
            questionId: 'question-1'
        });

        expect(result.value?.questionComments).toHaveLength(3);
    });

    it('should be able to fetch paginated question comments', async () => {
        for (let i = 0; i < 22; i++) {
            await inMemoryAnwersRepository.create(makeQuestionComment({
                questionId: new UniqueEntityID('question-1')
            }));
        }
        const result = await sut.execute({
            page: 2,
            questionId: 'question-1'
        });

        expect(result.value?.questionComments).toHaveLength(2);
    });
});
