import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // When the module starts connect it to the db
    constructor(private configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get("DATABASE_URL"),
                }
            }
        });
    }
    // Open a connection to the db when module is initialized
    async onModuleInit(): Promise<void> {
       await this.$connect();
    }
    // Close the connection to the db when done using the module
    async onModuleDestroy(): Promise<void> {
       await this.$disconnect();
    }
}
