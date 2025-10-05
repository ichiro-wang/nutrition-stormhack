type Gender = "M" | "F";

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
  activity_level: ActivityLevel;
  rec_calories: number;
  rec_protein: number;
  rec_carbs: number;
  rec_fats: number;
};

type NutritionDatum1 = {
  name: string;
  value: number;
};

type NutritionDatum2 = {
  Calories: number;
  "Serving Size g": number;
  "Servings Size (Qty)": number;
};

type Food = {
  id: number;
  user_id: number;
  food_name: string;
  quantity: number;
  image_url: string;
  nutrition_data: NutritionDatum1[];
  nutrition_data2: NutritionDatum2;
  date_logged: string;
};
