import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCep {

  @IsString()
  @IsNotEmpty()
  cep: string;
}