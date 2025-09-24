import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Service } from '../../services/schemas/service.schema';

@Schema()
export class Package extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }] })
    services: Service[];

    @Prop()
    description: string;
}

export const PackageSchema = SchemaFactory.createForClass(Package)