import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Env } from '@/infra/env';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory(config: ConfigService<Env>) {
                const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true }) as string;
                const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true }) as string;

                return {
                    signOptions: { algorithm: 'RS256' },
                    privateKey: Buffer.from(privateKey, 'base64'),
                    publicKey: Buffer.from(publicKey, 'base64')
                };
            }
        })
    ],
    providers: [JwtStrategy]
})
export class AuthModule { }