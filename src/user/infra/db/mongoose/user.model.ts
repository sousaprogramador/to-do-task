import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Transform(({ value }) => value.toString(), { toClassOnly: true })
  get id(): string {
    return this._id.toHexString();
  }

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
