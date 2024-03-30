import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnwersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Question Answers', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        inMemoryAnwersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
        sut = new FetchQuestionAnswersUseCase(inMemoryAnwersRepository);
    });

    it('should be able to fetch question answers', async () => {
        await inMemoryAnwersRepository.create(makeAnswer({
            questionId: new UniqueEntityID('question-1')
        }));
        await inMemoryAnwersRepository.create(makeAnswer({
            questionId: new UniqueEntityID('question-1')
        }));
        await inMemoryAnwersRepository.create(makeAnswer({
            questionId: new UniqueEntityID('question-1')
        }));

        const results = await sut.execute({
            page: 1,
            questionId: 'question-1'
        });

        expect(results.value?.answers).toHaveLength(3);
    });

    it('should be able to fetch paginated question answers', async () => {
        for (let i = 0; i < 22; i++) {
            await inMemoryAnwersRepository.create(makeAnswer({
                questionId: new UniqueEntityID('question-1')
            }));
        }
        const results = await sut.execute({
            page: 2,
            questionId: 'question-1'
        });

        expect(results.value?.answers).toHaveLength(2);
    });
});
