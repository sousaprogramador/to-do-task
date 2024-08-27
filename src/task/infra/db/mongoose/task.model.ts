import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transform } from 'class-transformer';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: Object })
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };

  @Prop()
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
