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

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'snack': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'drink': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'meal': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const SleepFoods = () => {
  return (
    <div className="space-y-8">
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
          <div key={index} className="food-card">
            <div className="title">
              {food.name}
              <span className={`badge ml-2 ${getCategoryColor(food.category)}`}>
                {food.category}
              </span>
            </div>
            <div className="desc">{food.benefits}</div>
            <div className="meta flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{food.timing}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Recipes (Purple Glow) */}
      <div className="sleep-glow-box mx-auto max-w-2xl p-8 pt-10 space-y-4">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center space-x-2">
            <ChefHat className="h-5 w-5 text-accent" />
            <span className="text-2xl font-semibold text-foreground">3-Ingredient Sleep Recipes</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Golden Milk</h4>
            <div className="text-violet-400 mb-1">Turmeric + Almond Milk + Honey</div>
            <div className="text-sm text-foreground/90">
              Warm 1 cup almond milk, add 1/2 tsp turmeric, 1 tsp honey
            </div>
            <hr className="border-violet-700/40 my-3"/>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Sleep Smoothie</h4>
            <div className="text-violet-400 mb-1">Banana + Chamomile Tea + Almonds</div>
            <div className="text-sm text-foreground/90">
              Blend frozen banana, cooled chamomile tea, 6 almonds
            </div>
            <hr className="border-violet-700/40 my-3"/>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Bedtime Bowl</h4>
            <div className="text-violet-400 mb-1">Oats + Banana + Cinnamon</div>
            <div className="text-sm text-foreground/90">
              Mix 1/2 cup oats, sliced banana, pinch of cinnamon with warm milk
            </div>
          </div>
        </div>
      </div>

      {/* General Guidelines (Purple Glow) */}
      <div className="sleep-glow-box mx-auto max-w-2xl p-8 space-y-2">
        <h3 className="font-semibold text-violet-400 mb-2">General Guidelines</h3>
        <ul className="text-base text-white/90 space-y-1 pl-2">
          <li>• Eat 1-2 hours before bed for optimal digestion</li>
          <li>• Avoid spicy, heavy, or acidic foods late at night</li>
          <li>• Stop caffeine intake at least 6 hours before bedtime</li>
          <li>• Stay hydrated but limit fluids 2 hours before sleep</li>
        </ul>
      </div>
    </div>
  );
};

export default SleepFoods;