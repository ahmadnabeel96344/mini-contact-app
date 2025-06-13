import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactsService {
    constructor( @InjectRepository(Contact) private repo: Repository<Contact> ) {}

    async findall() {
        return this.repo.find();
    }

    async create(name: string, phone: string) {
        const contact = this.repo.create({ name, phone });
        return this.repo.save(contact);
    }

    async update(id: number, name: string, phone: string) {
        return this.repo.update(id, { name, phone });
    }

    async delete(id: number) {
        return this.repo.delete(id);
    }
}
