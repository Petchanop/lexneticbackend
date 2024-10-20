import { IsNotEmpty } from "class-validator";
import { PRIORITY, STATUS, Task } from "../entities/tasks.entity";
import { ApiProperty } from "@nestjs/swagger";

export class createTaskDto {
    @IsNotEmpty()
    @ApiProperty()
    title: string

    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNotEmpty()
    @ApiProperty()
    status: STATUS

    @IsNotEmpty()
    @ApiProperty()
    priority: PRIORITY

    @IsNotEmpty()
    @ApiProperty()
    due_date: Date
}

export class updateTaskDto {
    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    status: STATUS

    @ApiProperty()
    priority: PRIORITY

    @ApiProperty()
    due_date: Date
}

export class taskResponseDto {
    @ApiProperty()
    title: string

    @ApiProperty()
    description: string

    @ApiProperty()
    status: STATUS

    @ApiProperty()
    priority: PRIORITY

    @ApiProperty()
    due_date: Date

    constructor(partial: Partial<Task>) {
        Object.assign(this, partial)
    }
}