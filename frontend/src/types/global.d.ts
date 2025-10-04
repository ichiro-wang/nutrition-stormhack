type Gender = "Male" | "Female";

type ActivityLevel =
  | "Sedentary"
  | "Lightly active"
  | "Moderately active"
  | "Very active"
  | "Extra active";

type User = {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
};

type Food = {
  id: number;
  
}