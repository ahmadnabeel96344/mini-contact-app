import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactsService } from './contacts.service';

@Controller('api/contacts')
@UseGuards(AuthGuard('jwt'))
export class ContactsController {
    constructor( private readonly contactsService: ContactsService ) {}

    @Get()
    findall() {
        return this.contactsService.findall();
    }

    @Post('create')
    create(@Body() body: {name: string, phone: string}) {
        return this.contactsService.create(body.name, body.phone);
    }

    @Put('update/:id')
    update(@Body() body: {name: string, phone: string}, @Param('id') id: number) {
        return this.contactsService.update(Number(id), body.name, body.phone);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: number) {
        return this.contactsService.delete(Number(id));
    }
}
