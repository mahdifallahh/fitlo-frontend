export interface Exercise {
  _id: string;
  name: string;
  gifUrl?: string;
  videoLink?: string;
  categoryId?: {
    _id: string;
    name: string;
  };
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