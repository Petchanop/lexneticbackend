import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class commentDto {
    @IsNotEmpty()
    @ApiProperty()
    comment: string
}