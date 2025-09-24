import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;


  @Prop({ enum: ['owner', 'customer'], default: 'customer' })
  role: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point', },
    coordinates: { type: [Number], index: '2dsphere' }
  })
  location?: { type: 'Point'; coordinates: [number, number]; };
}
export const UserSchema = SchemaFactory.createForClass(User)