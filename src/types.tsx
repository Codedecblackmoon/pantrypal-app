export type PantryItem = {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category?: string;
  expiry_date: string;
  status: string;
};

export type Recipe = {
  id: number;
  title: string;
  usedIngredientCount: number;
};