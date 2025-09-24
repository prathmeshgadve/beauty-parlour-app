import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Package } from 'src/packages/schemas/package.schema';
import { Parlour } from 'src/parlours/schemas/parlour.schema';
import { Service } from 'src/services/schemas/service.schema';
import { User } from 'src/users/user.schema';

@Schema()
export class Booking extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    customer: User;

    @Prop({ type: Types.ObjectId, ref: 'Parlour', required: true })
    parlour: Parlour;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }] })
    services: Service[];

    @Prop({ type: Types.ObjectId, ref: 'Package' })
    package?: Package;

    @Prop({ required: true })
    appointmentTime: Date;

    @Prop({ enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
    status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);