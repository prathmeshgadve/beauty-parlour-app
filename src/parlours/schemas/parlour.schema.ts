import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Package } from 'src/packages/schemas/package.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Staff } from 'src/staff/schemas/staff.schema';
import { User } from 'src/users/user.schema';

@Schema()
class Contact {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;
}

// Create the schema for the Contact class
export const ContactSchema = SchemaFactory.createForClass(Contact);

@Schema()
export class Parlour extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ type: ContactSchema, required: true })
  contact: Contact;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }] })
  services: Service[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Package' }] })
  packages: Package[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Staff' }] })
  staff: Staff[];

  @Prop()
  menu: string;
}

export const ParlourSchema = SchemaFactory.createForClass(Parlour);
ParlourSchema.index({ location: '2dsphere' });