import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsDefined({ message: 'Host must be defined' })
  @IsNotEmpty({ message: 'Host must not be empty' })
  readonly host: string;

  @IsNumber()
  @IsDefined({ message: 'Port must be defined' })
  @IsNotEmpty({ message: 'Port must not be empty' })
  readonly port: number;

  @IsString()
  @IsDefined({ message: 'User must be defined' })
  @IsNotEmpty({ message: 'User must not be empty' })
  readonly user: string;

  @IsString()
  @IsDefined({ message: 'Password must be defined' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  readonly password: string;
}
