import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) 
        private repo: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register( username: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);
        const user = this.repo.create({username, password: hashed});
        return this.repo.save(user);
    }

    async login( username:string, password: string ) {
        const user = await this.repo.findOne({ where: { username } });
        if (!user) {
            throw new Error('User not found');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error('Invalid credentials');
        }

        const payload = { username: user.username, sub: user.id };
        return { token: this.jwtService.sign(payload) };
    }
}
