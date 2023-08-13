import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsString,
  IsEmail,
} from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  experience: number;

  @IsNotEmpty()
  speciality: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  @IsArray()
  worker_schedule: string[];
}
