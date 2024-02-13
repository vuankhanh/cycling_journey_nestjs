import { Body, ConflictException, Controller, Logger, Post, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { UserService } from '../../common/services/user.service';

@Controller('auth')
export class AuthController {
    logger: Logger = new Logger(AuthController.name);
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Post('signup')
    @UsePipes(ValidationPipe)
    async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string, refreshToken: string }> {
        try {
            this.logger.log('Creating user.');
            const query = { username: signUpDto.username };
            const isUser = await this.userService.findOne(query);
            if (isUser) throw new ConflictException('User Already Exist');
            const user = await this.userService.create(signUpDto);
            return this.authService.createToken(user);
        } catch (error) {
            this.logger.error('Something went wrong in signup:', error);
            throw error;
        }
    }

    @Post('signin')
    @UsePipes(ValidationPipe)
    async signIn(@Body() signInDto: SignInDto): Promise<{ token: string, refreshToken: string }>{
        try {
            this.logger.log('Signing in user.');
            const { username, password } = signInDto;
            const account = await this.userService.validateAccount(username, password);
            if (!account) {
                throw new UnauthorizedException('Invalid username or password');
            }

            return this.authService.createToken(account);
        } catch (error) {
            this.logger.error('Something went wrong in signin:', error);
            throw error;
        }
    }
}