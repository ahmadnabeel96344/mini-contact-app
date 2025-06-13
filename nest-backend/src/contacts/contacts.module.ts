import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { PassportModule } from '@nestjs/passport';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
    imports: [TypeOrmModule.forFeature([Contact]), PassportModule],
    controllers: [ContactsController],
    providers: [ContactsService]

})
export class ContactsModule {}
