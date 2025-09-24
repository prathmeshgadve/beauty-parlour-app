import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Staff extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ start: Date, end: Date }] }) // Array of available time slots
  schedule: { start: Date; end: Date }[];
}

export const StaffSchema = SchemaFactory.createForClass(Staff);