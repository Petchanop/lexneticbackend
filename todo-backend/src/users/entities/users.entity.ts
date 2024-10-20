import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Timestamp,
    UpdateDateColumn,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
import { Task } from 'src/tasks/entities/tasks.entity';
  
  export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
  }
  
  @Entity()
  export class User {
    /**
     * this decorator will help to auto generate id for the table.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 50, nullable: false  })
    username: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    email: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false  })
    @Exclude()
    password: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.USER
    })
    role: UserRole;
  
    @CreateDateColumn({nullable: false})
    created_at: Timestamp;
  
    @UpdateDateColumn({nullable: false})
    updated_at: Timestamp;

    @OneToMany(() => Task, (task) => task.user, {
      cascade: ["insert", "update"]
    })
    tasks: Task[]
  
    constructor(partial: Partial<User>) {
      Object.assign(this, partial);
    }
  }