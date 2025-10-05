type Gender = "M" | "F";

type ActivityLevel =
  | "Sedentary"
  | "Lightly active"
  | "Moderately active"
  | "Very active"
  | "Extremely active";

type User = {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activity_level: ActivityLevel;
  rec_calories: number;
  rec_protein: number;
  rec_carbs: number;
  rec_fats: number;
};

type NutritionDatum = {
  name: string;
  value: number;
};



type Food = {
  id: number;
  user_id: number;
  food_name: string;
  quantity: number;
  image_url: string;
  nutrition_data: NutritionDatum[];
  nutrition_data2: NutritionDatum[];
  date_logged: string;
};
