export class CreateGradeDto {
  subjectId: number;
  name: string;
  displayOrder: number;
  schoolLevel: 'MIDDLE' | 'HIGH';
}
