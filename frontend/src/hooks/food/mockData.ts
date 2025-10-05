export const mockUser: User = {
  id: 1,
  name: "John Doe",
  age: 25,
  weight: 70, // kg
  height: 175, // cm
  gender: "M",
  activity_level: "Moderately active",
  rec_calories: 2500, // kcal
  rec_protein: 120, // g
  rec_carbs: 300, // g
  rec_fats: 70, // g
};

export const mockFoods: Food[] = [
  {
    id: 1,
    user_id: 3,
    food_name: "Egg",
    quantity: 1,
    image_url: "https://example.com/images/egg.jpg",
    nutrition_data: [
      { name: "Fat", value: 5 },
      { name: "Carbs", value: 0.6 },
      { name: "Protein", value: 6 },
      { name: "Cholesterol", value: 186 },
      { name: "Sodium", value: 62 },
    ],
    nutrition_data2: {
      Calories: 70,
      "Serving Size g": 50,
      "Servings Size (Qty)": 1,
    },
    date_logged: "2025-10-05T01:24:51.317362",
  },
  {
    id: 2,
    user_id: 3,
    food_name: "Apple",
    quantity: 1,
    image_url: "https://example.com/images/apple.jpg",
    nutrition_data: [
      { name: "Fat", value: 0.3 },
      { name: "Carbs", value: 25 },
      { name: "Protein", value: 0.5 },
      { name: "Cholesterol", value: 0 },
      { name: "Sodium", value: 2 },
    ],
    nutrition_data2: {
      Calories: 95,
      "Serving Size g": 182,
      "Servings Size (Qty)": 1,
    },
    date_logged: "2025-10-05T09:10:12.003241",
  },
  {
    id: 3,
    user_id: 3,
    food_name: "Grilled Chicken Breast",
    quantity: 1,
    image_url: "https://example.com/images/chicken_breast.jpg",
    nutrition_data: [
      { name: "Fat", value: 3.6 },
      { name: "Carbs", value: 0 },
      { name: "Protein", value: 31 },
      { name: "Cholesterol", value: 85 },
      { name: "Sodium", value: 74 },
    ],
    nutrition_data2: {
      Calories: 165,
      "Serving Size g": 100,
      "Servings Size (Qty)": 1,
    },
    date_logged: "2025-10-04T18:45:22.112431",
  },
  {
    id: 4,
    user_id: 3,
    food_name: "Banana",
    quantity: 1,
    image_url: "https://example.com/images/banana.jpg",
    nutrition_data: [
      { name: "Fat", value: 0.4 },
      { name: "Carbs", value: 27 },
      { name: "Protein", value: 1.3 },
      { name: "Cholesterol", value: 0 },
      { name: "Sodium", value: 1 },
    ],
    nutrition_data2: {
      Calories: 105,
      "Serving Size g": 118,
      "Servings Size (Qty)": 1,
    },
    date_logged: "2025-10-04T12:33:15.543211",
  },
];
