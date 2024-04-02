import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { AnswerAttachmentsList } from './answer-attachment-list';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { AnswerCreatedEvent } from './events/answer-created-event';

export interface AnswerProps {
	authorId: UniqueEntityID;
	questionId: UniqueEntityID;
	content: string;
	attachments: AnswerAttachmentsList;
	createdAt: Date;
	updatedAt?: Date | null;
}
export class Answer extends AggregateRoot<AnswerProps> {
    get authorId() {
        return this.props.authorId;
    }

    get questionId() {
        return this.props.questionId;
    }

    get content() {
        return this.props.content;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get attachments() {
        return this.props.attachments;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }

    get excerpt() {
        return this.content
            .substring(0,120)
            .trim()
            .concat('...');
    }

    private touch() {
        this.props.updatedAt = new Date();
    }

    set content(content: string) {
        this.props.content = content;
        this.touch();
    }

    set attachments(attachments: AnswerAttachmentsList) {
        this.props.attachments = attachments;
        this.touch();
    }

    static create(
        props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
        id?: UniqueEntityID
    ) {
        const answer = new Answer({
            ...props,
            createdAt: props.createdAt ?? new Date(),
            attachments: props.attachments || new AnswerAttachmentsList(),
        }, id);

        const isNewAnswer = !id;

        if(isNewAnswer) {
            answer.addDomainEvent(new AnswerCreatedEvent(answer));
        }

        return answer;
    }
}