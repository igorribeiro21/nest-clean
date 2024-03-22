import { AggregateRoot } from '@/core/entities/aggregate-root';
import { Slug } from './value-objects/slug';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import dayjs from 'dayjs';
import { QuestionAttachmentList } from './question-attachment-list';
import { QuestionBestAnswerChosenEvent } from './events/question-best-answer-chosen-event';

export interface QuestionProps {
	authorId: UniqueEntityID;
	bestAnswerID?: UniqueEntityID;
	title: string;
	content: string;
	slug: Slug;
	attachments: QuestionAttachmentList;
	createdAt: Date;
	updatedAt?: Date;
}
export class Question extends AggregateRoot<QuestionProps> {
    get authorId() {
        return this.props.authorId;
    }

    get bestAnswerID() {
        return this.props.bestAnswerID;
    }
	
    get title() {
        return this.props.title;
    }

    get slug() {
        return this.props.slug;
    }

    get content() {
        return this.props.content;
    }

    get attachments() {
        return this.props.attachments;
    }

    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }

    get isNew(): boolean {
        return dayjs().diff(this.createdAt, 'days') <= 3;
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

    set title(title: string) {
        this.props.title = title;
        this.props.slug = Slug.createFromText(title);
        this.touch();
    }

    set attachments(attachments: QuestionAttachmentList) {
        this.props.attachments = attachments;
        this.touch();
    }

    set content(content: string) {
        this.props.content = content;
        this.touch();
    }

    set bestAnswerID(bestAnswerID: UniqueEntityID | undefined) {
        if(bestAnswerID === undefined) {
            return;
        }

        if(this.props.bestAnswerID === undefined || !this.props.bestAnswerID.equals(bestAnswerID)) {
            this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerID));
        }

        this.props.bestAnswerID = bestAnswerID;
        this.touch();
    }

    static create(
        props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
        id?: UniqueEntityID
    ) {
        const question = new Question({
            ...props,
            slug: props.slug ?? Slug.createFromText(props.title),
            attachments: props.attachments ?? new QuestionAttachmentList(),
            createdAt: props.createdAt ?? new Date()
        }, id);

        return question;
    }
}