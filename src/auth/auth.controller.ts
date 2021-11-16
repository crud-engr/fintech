/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Body, Controller, Post, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { User } from './schema/user.schema';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async signup(@Body() signupDto: SignupDto): Promise<{status: string, message: string, token: string, user: User, code: number}> {
    return this.authService.signup(signupDto);
  }
}
