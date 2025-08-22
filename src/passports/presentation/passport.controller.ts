import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PassportService } from '../infrastructure/passport.service';
import { Passport } from '../domain/passport';

type PassportEvent = { organizationId: string; uuid: string };

@Controller()
export class PassportController {
  constructor(private passportService: PassportService) {}

  @EventPattern('passport_created')
  async handleUserCreated(data: PassportEvent) {
    await this.createPassport(data);
  }

  @EventPattern('passport_updated')
  async handlePassportUpdated(data: PassportEvent) {
    await this.createPassport(data);
  }

  async createPassport(data: PassportEvent) {
    const passport = Passport.create({
      ownedByOrganizationId: data.organizationId,
      uuid: data.uuid,
    });
    await this.passportService.save(passport);
  }
}
