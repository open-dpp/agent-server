import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundInDatabaseException } from '../../exceptions/service.exceptions';
import { PassportDoc } from './passport.schema';
import { Passport } from '../domain/passport';

@Injectable()
export class PassportService {
  constructor(
    @InjectModel(PassportDoc.name)
    private passportDoc: Model<PassportDoc>,
  ) {}

  convertToDomain(passportDoc: PassportDoc): Passport {
    return Passport.create({
      uuid: passportDoc._id,
      ownedByOrganizationId: passportDoc.ownedByOrganizationId,
    });
  }

  async save(passport: Passport) {
    const dataModelDoc = await this.passportDoc.findOneAndUpdate(
      { _id: passport.uuid },
      {
        ownedByOrganizationId: passport.ownedByOrganizationId,
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if none found
        runValidators: true,
      },
    );

    return this.convertToDomain(dataModelDoc);
  }

  async findOneOrFail(id: string) {
    const passportDocument = await this.passportDoc.findById(id);
    if (!passportDocument) {
      throw new NotFoundInDatabaseException(Passport.name);
    }
    return this.convertToDomain(passportDocument);
  }
}
