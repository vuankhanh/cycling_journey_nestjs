import { Body, ConflictException, Controller, Get, Logger, Post, Request, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { AccountService } from '../../shared/services/account.service';
import { AuthGuard } from '../../shared/guards/auth.guard';

@Controller('auth')
export class AuthController {
    logger: Logger = new Logger(AuthController.name);
    constructor(
        private readonly accountService: AccountService,
        private readonly authService: AuthService
    ) { }

    @Post('signup')
    @UsePipes(ValidationPipe)
    async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string, refreshToken: string }> {
        try {
            this.logger.log('Creating user.');
            const query = { username: signUpDto.username };
            const isExist = await this.accountService.findOne(query);
            if (isExist){
                throw new ConflictException('User Already Exist');
            }

            const account = await this.accountService.create(signUpDto);

            const token = this.authService.createToken(account);
            const refreshToken = await this.authService.createRefreshToken(account);
            return { token, refreshToken }
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
            const account = await this.accountService.validateAccount(username, password);
            if (!account) {
                throw new UnauthorizedException('Invalid username or password');
            }

            const token = this.authService.createToken(account);
            const refreshToken = await this.authService.createRefreshToken(account);
            return { token, refreshToken }
        } catch (error) {
            this.logger.error('Something went wrong in signin:', error);
            throw error;
        }
    }

    @Post('refresh_token')
    @UsePipes(ValidationPipe)
    async refreshToken(@Body('refreshToken') refreshToken: string): Promise<{ token: string }>{
        try {
            this.logger.log('Refreshing token.');
            const token = await this.authService.verifyRefreshToken(refreshToken);
            return { token }
        } catch (error) {
            this.logger.error('Something went wrong in refreshToken:', error);
            throw error;
        }
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    getProfile(@Request() req) {
        return req.payload;
    }

}