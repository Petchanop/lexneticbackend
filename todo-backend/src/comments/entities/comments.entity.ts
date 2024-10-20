import { UUID } from "crypto";
import { Task } from "src/tasks/entities/tasks.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @ManyToOne(() => Task, (task) => task.comments, {cascade: true})
    task: Task

    @Column()
    comment: string

    @CreateDateColumn({ nullable: false })
    created_at: Timestamp;

    @UpdateDateColumn({ nullable: false })
    updated_at: Timestamp;

    constructor(partial: Partial<Comment>) {
        Object.assign(this, partial);
    }
}