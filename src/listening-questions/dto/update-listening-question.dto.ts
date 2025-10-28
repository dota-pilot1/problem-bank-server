import { PartialType } from '@nestjs/mapped-types';
import { CreateListeningQuestionDto } from './create-listening-question.dto';

export class UpdateListeningQuestionDto extends PartialType(
  CreateListeningQuestionDto,
) {}
