import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PassportSchemaVersion {
  v1_0_0 = '1.0.0',
}

@Schema({ collection: 'passports' })
export class PassportDoc extends Document {
  @Prop({
    default: PassportSchemaVersion.v1_0_0,
    enum: PassportSchemaVersion,
  }) // Track schema version
  _schemaVersion: PassportSchemaVersion;

  @Prop({ required: true })
  _id: string;
  @Prop({ required: true })
  ownedByOrganizationId: string;
}
export const PassportDbSchema = SchemaFactory.createForClass(PassportDoc);
