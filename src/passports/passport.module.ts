import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PassportDbSchema,
  PassportDoc,
} from './infrastructure/passport.schema';
import { PassportService } from './infrastructure/passport.service';
import { PassportController } from './presentation/passport.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PassportDoc.name,
        schema: PassportDbSchema,
      },
    ]),
  ],
  controllers: [PassportController],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}
