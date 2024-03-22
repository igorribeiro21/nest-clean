import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository= new InMemoryQuestionAttachmentsRepository();
        inMemoryAnswerAttachmentsRepository= new InMemoryAnswerAttachmentsRepository();
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
        inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
        sut = new ChooseQuestionBestAnswerUseCase(inMemoryQuestionsRepository, inMemoryAnswerRepository);
    });

    it('should be able to choose question best answer', async () => {
        const question = makeQuestion();
        const answer = makeAnswer({
            questionId: question.id
        });

        inMemoryQuestionsRepository.create(question);
        inMemoryAnswerRepository.create(answer);

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString()
        });

        expect(inMemoryQuestionsRepository.items[0].bestAnswerID).toEqual(answer.id);
    });

    it('should not be able to choose another user question best answer', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        });
        const answer = makeAnswer({
            questionId: question.id
        });

        inMemoryQuestionsRepository.create(question);
        inMemoryAnswerRepository.create(answer);

        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: 'author-2'
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
