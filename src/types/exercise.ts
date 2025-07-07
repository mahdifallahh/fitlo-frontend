export interface Exercise {
  _id: string;
  name: string;
  description?: string;
  gifUrl?: string;
  videoLink?: string;
  categoryId?: {
    _id: string;
    name: string;
  };
  sets?: string;
  reps?: string;
}
export interface SelectedExercise extends Exercise {
  sets: string;
  reps: string;
}
interface Props {
  allExercises: Exercise[]; // 👈 این مهمه
  defaultSelected: SelectedExercise[];
  onSave: (selected: SelectedExercise[]) => void;
}