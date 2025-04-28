export interface ProgramExercise {
  name: string;
  sets: number;
  reps: number;
  gifUrl?: string;
  videoLink?: string;
  categoryName?: string;
}

export interface ProgramDay {
  day: string;
  exercises: ProgramExercise[];
}

export interface Program {
  _id: string;
  studentId: {
    name: string;
    phone: string;
  };
  days: ProgramDay[];
}
