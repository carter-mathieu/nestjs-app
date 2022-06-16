import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  // Export the PrismaService to be available in any other module
  exports: [PrismaService],
})
export class PrismaModule {}
