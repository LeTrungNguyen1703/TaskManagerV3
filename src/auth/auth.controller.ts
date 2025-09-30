import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginRequest } from './dto/create-auth.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { JwtPayload } from './interfaces/jwtPayload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({
    status: 200,
    description: 'Successful login returns JWT token.',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.....',
        },
        payload: {
          type: 'object',
          example: { sub: 1, username: 'john_doe' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  @Post('login')
  signIn(@Body() loginRequest: LoginRequest) {
    return this.authService.signIn(loginRequest);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile information.',
    schema: {
      properties: {
        sub: { type: 'number', example: 1 },
        username: { type: 'string', example: 'john_doe' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing token.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: JwtPayload }) {
    return req.user;
  }
}
