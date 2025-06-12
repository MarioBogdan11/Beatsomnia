
import React from 'react';
import { Apple, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FoodItem {
  name: string;
  benefits: string;
  timing: string;
  category: 'snack' | 'drink' | 'meal';
}

const sleepFoods: FoodItem[] = [
  {
    name: "Bananas",
    benefits: "Rich in magnesium and potassium for muscle relaxation",
    timing: "1-2 hours before bed",
    category: "snack"
  },
  {
    name: "Almonds",
    benefits: "High in melatonin and healthy fats",
    timing: "Small handful 30 mins before bed",
    category: "snack"
  },
  {
    name: "Chamomile Tea",
    benefits: "Natural sedative properties, reduces anxiety",
    timing: "45-60 mins before bed",
    category: "drink"
  },
  {
    name: "Oatmeal",
    benefits: "Complex carbs promote serotonin production",
    timing: "2-3 hours before bed",
    category: "meal"
  },
  {
    name: "Tart Cherry Juice",
    benefits: "Natural source of melatonin",
    timing: "1 hour before bed",
    category: "drink"
  },
  {
    name: "Whole Grain Toast with Almond Butter",
    benefits: "Magnesium + tryptophan combination",
    timing: "1-2 hours before bed",
    category: "snack"
  }
];

const quickRecipes = [
  {
    name: "Golden Milk",
    ingredients: "Turmeric + Almond Milk + Honey",
    instructions: "Warm 1 cup almond milk, add 1/2 tsp turmeric, 1 tsp honey"
  },
  {
    name: "Sleep Smoothie",
    ingredients: "Banana + Chamomile Tea + Almonds",
    instructions: "Blend frozen banana, cooled chamomile tea, 6 almonds"
  },
  {
    name: "Bedtime Bowl",
    ingredients: "Oats + Banana + Cinnamon",
    instructions: "Mix 1/2 cup oats, sliced banana, pinch of cinnamon with warm milk"
  }
];

const SleepFoods = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'snack': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'drink': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'meal': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Apple className="h-6 w-6 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Sleep-Friendly Foods</h2>
        </div>
        <p className="text-muted-foreground">
          Foods that naturally promote better sleep and digestion
        </p>
      </div>

      {/* Food List */}
      <div className="grid gap-4">
        {sleepFoods.map((food, index) => (
          <Card key={index} className="sleep-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{food.name}</h3>
                <Badge className={getCategoryColor(food.category)}>
                  {food.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{food.benefits}</p>
              <div className="flex items-center space-x-1 text-xs text-accent">
                <Clock className="h-3 w-3" />
                <span>{food.timing}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Recipes */}
      <Card className="sleep-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChefHat className="h-5 w-5 text-accent" />
            <span>3-Ingredient Sleep Recipes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickRecipes.map((recipe, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-foreground">{recipe.name}</h4>
              <p className="text-sm text-accent">{recipe.ingredients}</p>
              <p className="text-xs text-muted-foreground">{recipe.instructions}</p>
              {index < quickRecipes.length - 1 && <hr className="border-border/50" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* General Tips */}
      <Card className="sleep-card border-accent/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-accent mb-2">General Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Eat 1-2 hours before bed for optimal digestion</li>
            <li>• Avoid spicy, heavy, or acidic foods late at night</li>
            <li>• Stop caffeine intake at least 6 hours before bedtime</li>
            <li>• Stay hydrated but limit fluids 2 hours before sleep</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepFoods;
