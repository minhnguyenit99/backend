import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2002': 
        response.status(HttpStatus.CONFLICT).json({ message: 'A record with this unique data already exists.' });
        break;
      case 'P2025': 
        response.status(HttpStatus.NOT_FOUND).json({ message: 'The requested resource was not found.' });
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}