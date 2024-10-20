import { UUID } from "crypto"
import { User } from "src/users/entities/users.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm"
import { Comment } from "../../comments/entities/comments.entity"


export enum STATUS {
    COMPLETED,
    OPEN,
    PENDING,
    INPROGRESS,
    INREVIEW,
    ACCEPTED,
    REJECTED,
    CLOSED,
    OVERDUE,
}

export enum PRIORITY {
    URGENT,
    HIGH,
    NORMAL,
    LOW
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
    user: User

    @OneToMany(() => Comment, (comment) => comment.task,
        { cascade: ["insert", "update"] }
    )
    comments: Comment[]

    @Column({ nullable: false })
    title: string

    @Column({ nullable: false })
    description: string

    @Column({
        type: 'enum',
        enum: STATUS,
        default: STATUS.OPEN,
        nullable: false
    })
    status: STATUS

    @Column({
        type: 'enum',
        enum: PRIORITY,
        default: PRIORITY.NORMAL,
        nullable: false
    })
    priority: PRIORITY

    @Column({ nullable: false })
    due_date: Date

    @CreateDateColumn({ nullable: false })
    created_at: Timestamp;

    @UpdateDateColumn({ nullable: false })
    updated_at: Timestamp;

    constructor(partial: Partial<Task>) {
        Object.assign(this, partial);
    }
}