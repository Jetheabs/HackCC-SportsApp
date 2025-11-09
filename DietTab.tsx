import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Plus, X, Search } from 'lucide-react';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  category: string;
  image?: string;
  serving: string;
}

// Comprehensive food database
const foodDatabase: FoodItem[] = [
  // Breakfast items
  { id: 'scrambledeggs', name: 'Scrambled Eggs', calories: 180, carbs: 1, protein: 12, fat: 14, category: 'Breakfast', serving: '1 serving' },
  { id: 'omeletcheese', name: 'Omelet with Cheese', calories: 220, carbs: 2, protein: 14, fat: 16, category: 'Breakfast', serving: '1 serving' },
  { id: 'eggwhiteomelet', name: 'Egg White Omelet', calories: 150, carbs: 1, protein: 18, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'friedeggsbacon', name: 'Fried Eggs and Bacon', calories: 250, carbs: 1, protein: 20, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggsben', name: 'Eggs Benedict', calories: 340, carbs: 25, protein: 14, fat: 22, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pancakessyrup', name: 'Pancakes with Syrup', calories: 350, carbs: 55, protein: 8, fat: 9, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'blueberrypancakes', name: 'Blueberry Pancakes', calories: 320, carbs: 50, protein: 9, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'wafflesbutter', name: 'Waffles with Butter', calories: 310, carbs: 42, protein: 8, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'frenchtoast', name: 'French Toast', calories: 300, carbs: 35, protein: 10, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'avocadotoast', name: 'Avocado Toast', calories: 270, carbs: 26, protein: 8, fat: 14, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastburrito', name: 'Breakfast Burrito', calories: 420, carbs: 36, protein: 24, fat: 22, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'bagelcreamcheese', name: 'Bagel with Cream Cheese', calories: 310, carbs: 52, protein: 9, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cerealmilk', name: 'Cereal with Milk', calories: 240, carbs: 45, protein: 8, fat: 4, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'granolayogurt', name: 'Granola with Yogurt', calories: 280, carbs: 35, protein: 10, fat: 9, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'oatmealhoney', name: 'Oatmeal with Honey', calories: 230, carbs: 42, protein: 7, fat: 4, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'oatmealbanana', name: 'Oatmeal with Banana', calories: 250, carbs: 47, protein: 7, fat: 4, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'peanutbuttertoast', name: 'Peanut Butter Toast', calories: 280, carbs: 28, protein: 10, fat: 13, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1615110250484-e8c3b151b957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFudXQlMjBidXR0ZXJ8ZW58MXx8fHwxNzYyNjQ4MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'toastjam', name: 'Toast with Jam', calories: 200, carbs: 35, protein: 5, fat: 3, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastsandwich', name: 'Breakfast Sandwich', calories: 400, carbs: 35, protein: 20, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'croissantbutter', name: 'Croissant with Butter', calories: 330, carbs: 35, protein: 6, fat: 19, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'baconeggcheesebiscuit', name: 'Bacon, Egg & Cheese Biscuit', calories: 420, carbs: 33, protein: 21, fat: 23, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'sausageeggs', name: 'Sausage and Eggs', calories: 370, carbs: 2, protein: 24, fat: 28, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastquesadilla', name: 'Breakfast Quesadilla', calories: 390, carbs: 28, protein: 22, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfasttacos', name: 'Breakfast Tacos', calories: 340, carbs: 25, protein: 20, fat: 16, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggmuffinsandwich', name: 'Egg Muffin Sandwich', calories: 310, carbs: 28, protein: 19, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastwrap', name: 'Breakfast Wrap', calories: 350, carbs: 30, protein: 22, fat: 14, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'yogurtparfait', name: 'Yogurt Parfait', calories: 260, carbs: 35, protein: 12, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'proteinsmoothie', name: 'Protein Smoothie', calories: 280, carbs: 25, protein: 25, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBmcnVpdHxlbnwxfHx8fDE3NjI1NzAwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'fruitsmoothie', name: 'Fruit Smoothie', calories: 210, carbs: 45, protein: 5, fat: 2, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBmcnVpdHxlbnwxfHx8fDE3NjI1NzAwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pbananasmoothie', name: 'Peanut Butter Banana Smoothie', calories: 310, carbs: 40, protein: 15, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBmcnVpdHxlbnwxfHx8fDE3NjI1NzAwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'banananutmuffin', name: 'Banana Nut Muffin', calories: 340, carbs: 48, protein: 8, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBmcnVpdHxlbnwxfHx8fDE3NjI1NzAwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'blueberrymuffin', name: 'Blueberry Muffin', calories: 320, carbs: 45, protein: 7, fat: 11, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBmcnVpdHxlbnwxfHx8fDE3NjI1NzAwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chocolatechipmuffin', name: 'Chocolate Chip Muffin', calories: 350, carbs: 50, protein: 6, fat: 14, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBmcnVpdHxlbnwxfHx8fDE3NjI1NzAwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cinnamonroll', name: 'Cinnamon Roll', calories: 420, carbs: 60, protein: 5, fat: 16, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'doughnut', name: 'Doughnut', calories: 310, carbs: 38, protein: 4, fat: 15, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'englishmuffinbutter', name: 'English Muffin with Butter', calories: 220, carbs: 30, protein: 6, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'hashbrowns', name: 'Hash Browns', calories: 260, carbs: 25, protein: 4, fat: 16, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'homefries', name: 'Home Fries', calories: 240, carbs: 28, protein: 5, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastsausagelinks', name: 'Breakfast Sausage Links', calories: 210, carbs: 1, protein: 10, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'turkeybacon', name: 'Turkey Bacon', calories: 120, carbs: 1, protein: 10, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'canadianbacon', name: 'Canadian Bacon', calories: 160, carbs: 2, protein: 18, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastpotatoes', name: 'Breakfast Potatoes', calories: 200, carbs: 30, protein: 5, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastskillet', name: 'Breakfast Skillet', calories: 380, carbs: 28, protein: 20, fat: 22, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastbowl', name: 'Breakfast Bowl', calories: 350, carbs: 30, protein: 24, fat: 14, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastpizza', name: 'Breakfast Pizza', calories: 410, carbs: 45, protein: 20, fat: 16, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'steakeggs', name: 'Steak and Eggs', calories: 460, carbs: 4, protein: 40, fat: 26, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'biscuitsgravy', name: 'Biscuits and Gravy', calories: 480, carbs: 48, protein: 12, fat: 28, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenwaffles', name: 'Chicken and Waffles', calories: 620, carbs: 55, protein: 30, fat: 28, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastbagelsandwich', name: 'Breakfast Bagel Sandwich', calories: 420, carbs: 36, protein: 24, fat: 20, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'toasterwaffles', name: 'Toaster Waffles', calories: 260, carbs: 35, protein: 6, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastburritobowl', name: 'Breakfast Burrito Bowl', calories: 400, carbs: 35, protein: 26, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'greekyogurtberries', name: 'Greek Yogurt with Berries', calories: 190, carbs: 22, protein: 15, fat: 4, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cottagecheesefruit', name: 'Cottage Cheese with Fruit', calories: 210, carbs: 18, protein: 20, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'fruitsalad', name: 'Fruit Salad', calories: 120, carbs: 30, protein: 2, fat: 0, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'appleslicespb', name: 'Apple Slices with Peanut Butter', calories: 230, carbs: 20, protein: 6, fat: 14, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastcrepe', name: 'Breakfast Crepe', calories: 250, carbs: 30, protein: 9, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'almondbuttertoast', name: 'Almond Butter Toast', calories: 280, carbs: 26, protein: 8, fat: 14, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggspinach wrap', name: 'Egg and Spinach Wrap', calories: 300, carbs: 22, protein: 20, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggcheesecroissant', name: 'Egg and Cheese Croissant', calories: 340, carbs: 28, protein: 16, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastflatbread', name: 'Breakfast Flatbread', calories: 310, carbs: 32, protein: 18, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggavocadobowl', name: 'Egg and Avocado Bowl', calories: 280, carbs: 18, protein: 16, fat: 14, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chiapudding', name: 'Chia Pudding', calories: 230, carbs: 28, protein: 9, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'acaibowl', name: 'Acai Bowl', calories: 310, carbs: 45, protein: 7, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'proteinpancakes', name: 'Protein Pancakes', calories: 330, carbs: 28, protein: 25, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'overnightoats', name: 'Overnight Oats', calories: 280, carbs: 45, protein: 10, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'oatmealblueberries', name: 'Oatmeal with Blueberries', calories: 250, carbs: 40, protein: 8, fat: 4, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cerealbar', name: 'Cereal Bar', calories: 190, carbs: 32, protein: 4, fat: 4, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'granolabar', name: 'Granola Bar', calories: 210, carbs: 29, protein: 6, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastcasserole', name: 'Breakfast Casserole', calories: 420, carbs: 20, protein: 25, fat: 28, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastquiche', name: 'Breakfast Quiche', calories: 360, carbs: 18, protein: 22, fat: 24, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastfrittata', name: 'Breakfast Frittata', calories: 310, carbs: 12, protein: 28, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastpanini', name: 'Breakfast Panini', calories: 380, carbs: 32, protein: 22, fat: 16, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'hamcheesecroissant', name: 'Ham and Cheese Croissant', calories: 370, carbs: 30, protein: 18, fat: 22, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'turkeysausagepatty', name: 'Turkey Sausage Patty', calories: 190, carbs: 1, protein: 14, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'sweetpotatohash', name: 'Sweet Potato Hash', calories: 240, carbs: 28, protein: 6, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1730815048561-45df6f7f331d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfasttostada', name: 'Breakfast Tostada', calories: 300, carbs: 30, protein: 16, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastburger', name: 'Breakfast Burger', calories: 480, carbs: 38, protein: 28, fat: 22, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'bagellox', name: 'Bagel with Lox', calories: 320, carbs: 38, protein: 18, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pumpkinspiceoatmeal', name: 'Pumpkin Spice Oatmeal', calories: 230, carbs: 42, protein: 6, fat: 3, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'almondcroissant', name: 'Almond Croissant', calories: 390, carbs: 40, protein: 9, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pecanpancakes', name: 'Pecan Pancakes', calories: 370, carbs: 45, protein: 9, fat: 14, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cinnamonfrenchtoast', name: 'Cinnamon French Toast', calories: 340, carbs: 40, protein: 10, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'proteinmuffin', name: 'Protein Muffin', calories: 290, carbs: 25, protein: 22, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBmcnVpdHxlbnwxfHx8fDE3NjI1NzAwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggbake', name: 'Egg Bake', calories: 310, carbs: 12, protein: 24, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cerealstrawberries', name: 'Cereal with Strawberries', calories: 250, carbs: 42, protein: 8, fat: 3, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'applecinnamonoatmeal', name: 'Apple Cinnamon Oatmeal', calories: 240, carbs: 44, protein: 6, fat: 3, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastwrapsalsa', name: 'Breakfast Wrap with Salsa', calories: 320, carbs: 30, protein: 20, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggscramble bowl', name: 'Egg Scramble Bowl', calories: 280, carbs: 20, protein: 22, fat: 12, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'huevosrancheros', name: 'Huevos Rancheros', calories: 380, carbs: 30, protein: 20, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastburritosupreme', name: 'Breakfast Burrito Supreme', calories: 460, carbs: 42, protein: 25, fat: 22, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggsflorentine', name: 'Eggs Florentine', calories: 310, carbs: 10, protein: 18, fat: 22, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'avocadoeggtoast', name: 'Avocado Egg Toast', calories: 290, carbs: 24, protein: 10, fat: 16, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'bananapancakes', name: 'Banana Pancakes', calories: 320, carbs: 45, protein: 9, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'berrysmoothiebowl', name: 'Berry Smoothie Bowl', calories: 300, carbs: 48, protein: 8, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'peanutbutteroatmeal', name: 'Peanut Butter Oatmeal', calories: 310, carbs: 32, protein: 12, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'wholegrainalmondbutter', name: 'Whole Grain Toast with Almond Butter', calories: 270, carbs: 24, protein: 9, fat: 13, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'coconutyogurtgranola', name: 'Coconut Yogurt with Granola', calories: 240, carbs: 26, protein: 8, fat: 8, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'breakfastbiscuitsandwich', name: 'Breakfast Biscuit Sandwich', calories: 400, carbs: 35, protein: 22, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'spinachfetaomelet', name: 'Spinach and Feta Omelet', calories: 280, carbs: 8, protein: 24, fat: 18, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggturkeywrap', name: 'Egg and Turkey Wrap', calories: 310, carbs: 28, protein: 22, fat: 10, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'greekyogurtgranolahoney', name: 'Greek Yogurt with Granola and Honey', calories: 260, carbs: 32, protein: 12, fat: 6, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  
  // Lunch items
  { id: 'grilledchickensandwich', name: 'Grilled Chicken Sandwich', calories: 420, carbs: 35, protein: 35, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cheeseburger', name: 'Cheeseburger', calories: 560, carbs: 42, protein: 32, fat: 28, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'doublecheeseburger', name: 'Double Cheeseburger', calories: 720, carbs: 45, protein: 45, fat: 40, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'turkeyclubsandwich', name: 'Turkey Club Sandwich', calories: 480, carbs: 38, protein: 32, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'bltsandwich', name: 'BLT Sandwich', calories: 390, carbs: 36, protein: 22, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'tunasaladsandwich', name: 'Tuna Salad Sandwich', calories: 410, carbs: 28, protein: 30, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickencaesarsalad', name: 'Chicken Caesar Salad', calories: 380, carbs: 16, protein: 32, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cobbsalad', name: 'Cobb Salad', calories: 420, carbs: 14, protein: 34, fat: 28, category: 'Lunch', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'buffalochickenwrap', name: 'Buffalo Chicken Wrap', calories: 480, carbs: 38, protein: 36, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'turkeyavocadowrap', name: 'Turkey Avocado Wrap', calories: 430, carbs: 34, protein: 32, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'grilledcheesesandwich', name: 'Grilled Cheese Sandwich', calories: 380, carbs: 40, protein: 14, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'hamswisssandwich', name: 'Ham and Swiss Sandwich', calories: 420, carbs: 38, protein: 28, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'phillycheesesteak', name: 'Philly Cheesesteak', calories: 610, carbs: 48, protein: 42, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pulledporksandwich', name: 'Pulled Pork Sandwich', calories: 540, carbs: 38, protein: 36, fat: 24, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'meatballsub', name: 'Meatball Sub', calories: 620, carbs: 52, protein: 40, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'roastbeefsandwich', name: 'Roast Beef Sandwich', calories: 460, carbs: 38, protein: 34, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenquesadilla', name: 'Chicken Quesadilla', calories: 520, carbs: 42, protein: 36, fat: 24, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'beefburrito', name: 'Beef Burrito', calories: 640, carbs: 55, protein: 38, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'beanburrito', name: 'Bean Burrito', calories: 480, carbs: 65, protein: 18, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenricebowl', name: 'Chicken Rice Bowl', calories: 520, carbs: 55, protein: 36, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'teriyakichickenbowl', name: 'Teriyaki Chicken Bowl', calories: 560, carbs: 58, protein: 38, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'beefricebowl', name: 'Beef Rice Bowl', calories: 590, carbs: 54, protein: 40, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'shrimpfriedrice', name: 'Shrimp Fried Rice', calories: 480, carbs: 62, protein: 25, fat: 12, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenfriedrice', name: 'Chicken Fried Rice', calories: 510, carbs: 60, protein: 30, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'burritobowl', name: 'Burrito Bowl', calories: 580, carbs: 62, protein: 38, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenfajitabowl', name: 'Chicken Fajita Bowl', calories: 540, carbs: 48, protein: 40, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'turkeyburger', name: 'Turkey Burger', calories: 490, carbs: 40, protein: 38, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'veggieburger', name: 'Veggie Burger', calories: 420, carbs: 45, protein: 22, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'blackbeanburger', name: 'Black Bean Burger', calories: 430, carbs: 46, protein: 24, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickentendersfries', name: 'Chicken Tenders with Fries', calories: 720, carbs: 60, protein: 35, fat: 32, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'grilledchickentacos', name: 'Grilled Chicken Tacos', calories: 470, carbs: 42, protein: 38, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'fishtacos', name: 'Fish Tacos', calories: 480, carbs: 44, protein: 32, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'beeftacos', name: 'Beef Tacos', calories: 530, carbs: 46, protein: 34, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'bbqchickensandwich', name: 'BBQ Chicken Sandwich', calories: 510, carbs: 48, protein: 36, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'bbqpulledporkplate', name: 'BBQ Pulled Pork Plate', calories: 640, carbs: 42, protein: 42, fat: 28, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'grilledsalmonsalad', name: 'Grilled Salmon Salad', calories: 410, carbs: 20, protein: 35, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'shrimpsalad', name: 'Shrimp Salad', calories: 380, carbs: 18, protein: 30, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'caesarwrap', name: 'Caesar Wrap', calories: 420, carbs: 34, protein: 28, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenpita', name: 'Chicken Pita', calories: 460, carbs: 36, protein: 34, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'falafelwrap', name: 'Falafel Wrap', calories: 500, carbs: 52, protein: 18, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'veggiewrap', name: 'Veggie Wrap', calories: 410, carbs: 45, protein: 16, fat: 12, category: 'Lunch', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenshawarmawrap', name: 'Chicken Shawarma Wrap', calories: 530, carbs: 42, protein: 36, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'buffalowings8pc', name: 'Buffalo Wings (8pc)', calories: 640, carbs: 20, protein: 42, fat: 42, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickennuggetsfries', name: 'Chicken Nuggets with Fries', calories: 680, carbs: 55, protein: 30, fat: 28, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'grilledchickenpanini', name: 'Grilled Chicken Panini', calories: 460, carbs: 34, protein: 32, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'turkeypanini', name: 'Turkey Panini', calories: 440, carbs: 34, protein: 30, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'hampanini', name: 'Ham Panini', calories: 470, carbs: 34, protein: 28, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'capresesandwich', name: 'Caprese Sandwich', calories: 390, carbs: 36, protein: 18, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBmcmVzaHxlbnwxfHx8fDE3NjI2NDgwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'italiansub', name: 'Italian Sub', calories: 620, carbs: 50, protein: 34, fat: 30, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'reubensandwich', name: 'Reuben Sandwich', calories: 540, carbs: 42, protein: 30, fat: 24, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'tacosalad', name: 'Taco Salad', calories: 510, carbs: 38, protein: 34, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'greeksaladchicken', name: 'Greek Salad with Chicken', calories: 420, carbs: 20, protein: 36, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chefsalad', name: 'Chef Salad', calories: 400, carbs: 14, protein: 35, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'buffalochickensalad', name: 'Buffalo Chicken Salad', calories: 440, carbs: 18, protein: 38, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'spinachsaladeggs', name: 'Spinach Salad with Eggs', calories: 360, carbs: 18, protein: 30, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickennoodlesoup', name: 'Chicken Noodle Soup', calories: 280, carbs: 32, protein: 18, fat: 6, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'tomatosoupgrilledcheese', name: 'Tomato Soup with Grilled Cheese', calories: 520, carbs: 45, protein: 22, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBmcmVzaHxlbnwxfHx8fDE3NjI2NDgwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'clamchowder', name: 'Clam Chowder', calories: 420, carbs: 34, protein: 18, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'broccolicheddarsoup', name: 'Broccoli Cheddar Soup', calories: 380, carbs: 28, protein: 15, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'minestronesoup', name: 'Minestrone Soup', calories: 320, carbs: 45, protein: 12, fat: 6, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'beefchili', name: 'Beef Chili', calories: 510, carbs: 36, protein: 34, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'turkeychili', name: 'Turkey Chili', calories: 470, carbs: 34, protein: 36, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenchili', name: 'Chicken Chili', calories: 480, carbs: 34, protein: 38, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'macandcheese', name: 'Mac and Cheese', calories: 540, carbs: 56, protein: 22, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pastasalad', name: 'Pasta Salad', calories: 420, carbs: 52, protein: 12, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'potatosalad', name: 'Potato Salad', calories: 360, carbs: 40, protein: 6, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'coleslaw', name: 'Coleslaw', calories: 180, carbs: 20, protein: 3, fat: 10, category: 'Lunch', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'gardensaladdressing', name: 'Garden Salad with Dressing', calories: 280, carbs: 22, protein: 6, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'avocadochickensalad', name: 'Avocado Chicken Salad', calories: 420, carbs: 18, protein: 32, fat: 24, category: 'Lunch', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'bbqchickenpizza', name: 'BBQ Chicken Pizza', calories: 580, carbs: 54, protein: 30, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pepperonipizza', name: 'Pepperoni Pizza (2 slices)', calories: 620, carbs: 58, protein: 28, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cheesepizza', name: 'Cheese Pizza (2 slices)', calories: 540, carbs: 60, protein: 22, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'veggiepizza', name: 'Veggie Pizza (2 slices)', calories: 500, carbs: 56, protein: 20, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenalfredopasta', name: 'Chicken Alfredo Pasta', calories: 720, carbs: 64, protein: 38, fat: 32, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'spaghettim arinara', name: 'Spaghetti Marinara', calories: 580, carbs: 70, protein: 18, fat: 12, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'spaghettimeatsauce', name: 'Spaghetti Meat Sauce', calories: 640, carbs: 68, protein: 26, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pennevodka', name: 'Penne Vodka', calories: 610, carbs: 65, protein: 20, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickenparmesan', name: 'Chicken Parmesan', calories: 690, carbs: 55, protein: 40, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'lasagna', name: 'Lasagna', calories: 660, carbs: 60, protein: 32, fat: 24, category: 'Lunch', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'beefstroganoff', name: 'Beef Stroganoff', calories: 620, carbs: 48, protein: 36, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'friedchickensandwich', name: 'Fried Chicken Sandwich', calories: 620, carbs: 46, protein: 34, fat: 28, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'crispychickenwrap', name: 'Crispy Chicken Wrap', calories: 550, carbs: 42, protein: 32, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'grilledchickenwrap', name: 'Grilled Chicken Wrap', calories: 480, carbs: 36, protein: 34, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'turkeycranberrysandwich', name: 'Turkey Cranberry Sandwich', calories: 460, carbs: 42, protein: 28, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'avocadoturkeysandwich', name: 'Avocado Turkey Sandwich', calories: 470, carbs: 38, protein: 32, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'eggsaladsandwich', name: 'Egg Salad Sandwich', calories: 420, carbs: 32, protein: 20, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'tunamelt', name: 'Tuna Melt', calories: 510, carbs: 36, protein: 30, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pulledbbqchickensandwich', name: 'Pulled BBQ Chicken Sandwich', calories: 490, carbs: 38, protein: 34, fat: 18, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'chickencaesarwrap', name: 'Chicken Caesar Wrap', calories: 470, carbs: 34, protein: 32, fat: 16, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'veggierice bowl', name: 'Veggie Rice Bowl', calories: 420, carbs: 58, protein: 12, fat: 10, category: 'Lunch', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'quinoasaladveggies', name: 'Quinoa Salad with Veggies', calories: 390, carbs: 52, protein: 10, fat: 8, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'sweetpotatobowl', name: 'Sweet Potato Bowl', calories: 420, carbs: 55, protein: 14, fat: 12, category: 'Lunch', image: 'https://images.unsplash.com/photo-1730815048561-45df6f7f331d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'buddhabowl', name: 'Buddha Bowl', calories: 440, carbs: 50, protein: 16, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'pokebowlsalmon', name: 'Poke Bowl with Salmon', calories: 480, carbs: 40, protein: 36, fat: 14, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'cubansandwich', name: 'Cuban Sandwich', calories: 590, carbs: 44, protein: 34, fat: 26, category: 'Lunch', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'phillychickencheesesteak', name: 'Philly Chicken Cheesesteak', calories: 600, carbs: 48, protein: 40, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'fishsandwich', name: 'Fish Sandwich', calories: 520, carbs: 44, protein: 30, fat: 20, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'shrimppoboy', name: 'Shrimp Po\' Boy', calories: 560, carbs: 48, protein: 32, fat: 22, category: 'Lunch', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'bbqribsandwich', name: 'BBQ Rib Sandwich', calories: 650, carbs: 46, protein: 38, fat: 30, category: 'Lunch', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  
  // Dinner items
  { id: 'dinner_grilledchickensandwich', name: 'Grilled Chicken Sandwich', calories: 420, carbs: 35, protein: 35, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_cheeseburger', name: 'Cheeseburger', calories: 560, carbs: 42, protein: 32, fat: 28, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_doublecheeseburger', name: 'Double Cheeseburger', calories: 720, carbs: 45, protein: 45, fat: 40, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_turkeyclubsandwich', name: 'Turkey Club Sandwich', calories: 480, carbs: 38, protein: 32, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_bltsandwich', name: 'BLT Sandwich', calories: 390, carbs: 36, protein: 22, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_tunasaladsandwich', name: 'Tuna Salad Sandwich', calories: 410, carbs: 28, protein: 30, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickencaesarsalad', name: 'Chicken Caesar Salad', calories: 380, carbs: 16, protein: 32, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_cobbsalad', name: 'Cobb Salad', calories: 420, carbs: 14, protein: 34, fat: 28, category: 'Dinner', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_buffalochickenwrap', name: 'Buffalo Chicken Wrap', calories: 480, carbs: 38, protein: 36, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_turkeyavocadowrap', name: 'Turkey Avocado Wrap', calories: 430, carbs: 34, protein: 32, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_grilledcheesesandwich', name: 'Grilled Cheese Sandwich', calories: 380, carbs: 40, protein: 14, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_hamswisssandwich', name: 'Ham and Swiss Sandwich', calories: 420, carbs: 38, protein: 28, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_phillycheesesteak', name: 'Philly Cheesesteak', calories: 610, carbs: 48, protein: 42, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_pulledporksandwich', name: 'Pulled Pork Sandwich', calories: 540, carbs: 38, protein: 36, fat: 24, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_meatballsub', name: 'Meatball Sub', calories: 620, carbs: 52, protein: 40, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_roastbeefsandwich', name: 'Roast Beef Sandwich', calories: 460, carbs: 38, protein: 34, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenquesadilla', name: 'Chicken Quesadilla', calories: 520, carbs: 42, protein: 36, fat: 24, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_beefburrito', name: 'Beef Burrito', calories: 640, carbs: 55, protein: 38, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_beanburrito', name: 'Bean Burrito', calories: 480, carbs: 65, protein: 18, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenricebowl', name: 'Chicken Rice Bowl', calories: 520, carbs: 55, protein: 36, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_teriyakichickenbowl', name: 'Teriyaki Chicken Bowl', calories: 560, carbs: 58, protein: 38, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_beefricebowl', name: 'Beef Rice Bowl', calories: 590, carbs: 54, protein: 40, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_shrimpfriedrice', name: 'Shrimp Fried Rice', calories: 480, carbs: 62, protein: 25, fat: 12, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenfriedrice', name: 'Chicken Fried Rice', calories: 510, carbs: 60, protein: 30, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_burritobowl', name: 'Burrito Bowl', calories: 580, carbs: 62, protein: 38, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenfajitabowl', name: 'Chicken Fajita Bowl', calories: 540, carbs: 48, protein: 40, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_turkeyburger', name: 'Turkey Burger', calories: 490, carbs: 40, protein: 38, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_veggieburger', name: 'Veggie Burger', calories: 420, carbs: 45, protein: 22, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_blackbeanburger', name: 'Black Bean Burger', calories: 430, carbs: 46, protein: 24, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickentendersfries', name: 'Chicken Tenders with Fries', calories: 720, carbs: 60, protein: 35, fat: 32, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_grilledchickentacos', name: 'Grilled Chicken Tacos', calories: 470, carbs: 42, protein: 38, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_fishtacos', name: 'Fish Tacos', calories: 480, carbs: 44, protein: 32, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_beeftacos', name: 'Beef Tacos', calories: 530, carbs: 46, protein: 34, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_bbqchickensandwich', name: 'BBQ Chicken Sandwich', calories: 510, carbs: 48, protein: 36, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_bbqpulledporkplate', name: 'BBQ Pulled Pork Plate', calories: 640, carbs: 42, protein: 42, fat: 28, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_grilledsalmonsalad', name: 'Grilled Salmon Salad', calories: 410, carbs: 20, protein: 35, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_shrimpsalad', name: 'Shrimp Salad', calories: 380, carbs: 18, protein: 30, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_caesarwrap', name: 'Caesar Wrap', calories: 420, carbs: 34, protein: 28, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenpita', name: 'Chicken Pita', calories: 460, carbs: 36, protein: 34, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_falafelwrap', name: 'Falafel Wrap', calories: 500, carbs: 52, protein: 18, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_veggiewrap', name: 'Veggie Wrap', calories: 410, carbs: 45, protein: 16, fat: 12, category: 'Dinner', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenshawarmawrap', name: 'Chicken Shawarma Wrap', calories: 530, carbs: 42, protein: 36, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_buffalowings8pc', name: 'Buffalo Wings (8pc)', calories: 640, carbs: 20, protein: 42, fat: 42, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickennuggetsfries', name: 'Chicken Nuggets with Fries', calories: 680, carbs: 55, protein: 30, fat: 28, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_grilledchickenpanini', name: 'Grilled Chicken Panini', calories: 460, carbs: 34, protein: 32, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_turkeypanini', name: 'Turkey Panini', calories: 440, carbs: 34, protein: 30, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_hampanini', name: 'Ham Panini', calories: 470, carbs: 34, protein: 28, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_capresesandwich', name: 'Caprese Sandwich', calories: 390, carbs: 36, protein: 18, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBmcmVzaHxlbnwxfHx8fDE3NjI2NDgwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_italiansub', name: 'Italian Sub', calories: 620, carbs: 50, protein: 34, fat: 30, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_reubensandwich', name: 'Reuben Sandwich', calories: 540, carbs: 42, protein: 30, fat: 24, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_tacosalad', name: 'Taco Salad', calories: 510, carbs: 38, protein: 34, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_greeksaladchicken', name: 'Greek Salad with Chicken', calories: 420, carbs: 20, protein: 36, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chefsalad', name: 'Chef Salad', calories: 400, carbs: 14, protein: 35, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_buffalochickensalad', name: 'Buffalo Chicken Salad', calories: 440, carbs: 18, protein: 38, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_spinachsaladeggs', name: 'Spinach Salad with Eggs', calories: 360, carbs: 18, protein: 30, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickennoodlesoup', name: 'Chicken Noodle Soup', calories: 280, carbs: 32, protein: 18, fat: 6, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_tomatosoupgrilledcheese', name: 'Tomato Soup with Grilled Cheese', calories: 520, carbs: 45, protein: 22, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBmcmVzaHxlbnwxfHx8fDE3NjI2NDgwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_clamchowder', name: 'Clam Chowder', calories: 420, carbs: 34, protein: 18, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_broccolicheddarsoup', name: 'Broccoli Cheddar Soup', calories: 380, carbs: 28, protein: 15, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_minestronesoup', name: 'Minestrone Soup', calories: 320, carbs: 45, protein: 12, fat: 6, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_beefchili', name: 'Beef Chili', calories: 510, carbs: 36, protein: 34, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_turkeychili', name: 'Turkey Chili', calories: 470, carbs: 34, protein: 36, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenchili', name: 'Chicken Chili', calories: 480, carbs: 34, protein: 38, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_macandcheese', name: 'Mac and Cheese', calories: 540, carbs: 56, protein: 22, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_pastasalad', name: 'Pasta Salad', calories: 420, carbs: 52, protein: 12, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_potatosalad', name: 'Potato Salad', calories: 360, carbs: 40, protein: 6, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_coleslaw', name: 'Coleslaw', calories: 180, carbs: 20, protein: 3, fat: 10, category: 'Dinner', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_gardensaladdressing', name: 'Garden Salad with Dressing', calories: 280, carbs: 22, protein: 6, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_avocadochickensalad', name: 'Avocado Chicken Salad', calories: 420, carbs: 18, protein: 32, fat: 24, category: 'Dinner', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_bbqchickenpizza', name: 'BBQ Chicken Pizza', calories: 580, carbs: 54, protein: 30, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_pepperonipizza', name: 'Pepperoni Pizza (2 slices)', calories: 620, carbs: 58, protein: 28, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_cheesepizza', name: 'Cheese Pizza (2 slices)', calories: 540, carbs: 60, protein: 22, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_veggiepizza', name: 'Veggie Pizza (2 slices)', calories: 500, carbs: 56, protein: 20, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenalfredopasta', name: 'Chicken Alfredo Pasta', calories: 720, carbs: 64, protein: 38, fat: 32, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_spaghettim arinara', name: 'Spaghetti Marinara', calories: 580, carbs: 70, protein: 18, fat: 12, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_spaghettimeatsauce', name: 'Spaghetti Meat Sauce', calories: 640, carbs: 68, protein: 26, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_pennevodka', name: 'Penne Vodka', calories: 610, carbs: 65, protein: 20, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickenparmesan', name: 'Chicken Parmesan', calories: 690, carbs: 55, protein: 40, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_lasagna', name: 'Lasagna', calories: 660, carbs: 60, protein: 32, fat: 24, category: 'Dinner', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_beefstroganoff', name: 'Beef Stroganoff', calories: 620, carbs: 48, protein: 36, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_friedchickensandwich', name: 'Fried Chicken Sandwich', calories: 620, carbs: 46, protein: 34, fat: 28, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_crispychickenwrap', name: 'Crispy Chicken Wrap', calories: 550, carbs: 42, protein: 32, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_grilledchickenwrap', name: 'Grilled Chicken Wrap', calories: 480, carbs: 36, protein: 34, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_turkeycranberrysandwich', name: 'Turkey Cranberry Sandwich', calories: 460, carbs: 42, protein: 28, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_avocadoturkeysandwich', name: 'Avocado Turkey Sandwich', calories: 470, carbs: 38, protein: 32, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_eggsaladsandwich', name: 'Egg Salad Sandwich', calories: 420, carbs: 32, protein: 20, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1562918005-50afb98e5d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjYxMTUxNXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_tunamelt', name: 'Tuna Melt', calories: 510, carbs: 36, protein: 30, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_pulledbbqchickensandwich', name: 'Pulled BBQ Chicken Sandwich', calories: 490, carbs: 38, protein: 34, fat: 18, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_chickencaesarwrap', name: 'Chicken Caesar Wrap', calories: 470, carbs: 34, protein: 32, fat: 16, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_veggierice bowl', name: 'Veggie Rice Bowl', calories: 420, carbs: 58, protein: 12, fat: 10, category: 'Dinner', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_quinoasaladveggies', name: 'Quinoa Salad with Veggies', calories: 390, carbs: 52, protein: 10, fat: 8, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_sweetpotatobowl', name: 'Sweet Potato Bowl', calories: 420, carbs: 55, protein: 14, fat: 12, category: 'Dinner', image: 'https://images.unsplash.com/photo-1730815048561-45df6f7f331d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_buddhabowl', name: 'Buddha Bowl', calories: 440, carbs: 50, protein: 16, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_pokebowlsalmon', name: 'Poke Bowl with Salmon', calories: 480, carbs: 40, protein: 36, fat: 14, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_cubansandwich', name: 'Cuban Sandwich', calories: 590, carbs: 44, protein: 34, fat: 26, category: 'Dinner', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_phillychickencheesesteak', name: 'Philly Chicken Cheesesteak', calories: 600, carbs: 48, protein: 40, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_fishsandwich', name: 'Fish Sandwich', calories: 520, carbs: 44, protein: 30, fat: 20, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_shrimppoboy', name: 'Shrimp Po\' Boy', calories: 560, carbs: 48, protein: 32, fat: 22, category: 'Dinner', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'dinner_bbqribsandwich', name: 'BBQ Rib Sandwich', calories: 650, carbs: 46, protein: 38, fat: 30, category: 'Dinner', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  
  // Snacks
  { id: 'snack_apple', name: 'Apple', calories: 95, carbs: 25, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'snack_banana', name: 'Banana', calories: 105, carbs: 27, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'snack_orange', name: 'Orange', calories: 80, carbs: 19, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'snack_grapes', name: 'Grapes (1 cup)', calories: 100, carbs: 26, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_strawberries', name: 'Strawberries (1 cup)', calories: 50, carbs: 12, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_blueberries', name: 'Blueberries (1 cup)', calories: 85, carbs: 21, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_pineapplechunks', name: 'Pineapple Chunks', calories: 80, carbs: 20, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_watermelon', name: 'Watermelon (1 cup)', calories: 46, carbs: 11, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_peach', name: 'Peach', calories: 70, carbs: 17, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'snack_pear', name: 'Pear', calories: 100, carbs: 27, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'snack_babycarrots', name: 'Baby Carrots (1 cup)', calories: 50, carbs: 12, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_celerypeanutbutter', name: 'Celery with Peanut Butter', calories: 160, carbs: 10, protein: 6, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'snack_cucumberhummus', name: 'Cucumber Slices with Hummus', calories: 140, carbs: 12, protein: 4, fat: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'snack_mixednuts', name: 'Mixed Nuts (1 oz)', calories: 170, carbs: 6, protein: 6, fat: 15, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_almonds', name: 'Almonds (1 oz)', calories: 164, carbs: 6, protein: 6, fat: 14, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_cashews', name: 'Cashews (1 oz)', calories: 157, carbs: 9, protein: 5, fat: 12, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_pistachios', name: 'Pistachios (1 oz)', calories: 160, carbs: 8, protein: 6, fat: 13, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_trailmix', name: 'Trail Mix (1/4 cup)', calories: 200, carbs: 16, protein: 5, fat: 12, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1/4 cup' },
  { id: 'snack_peanuts', name: 'Peanuts (1 oz)', calories: 165, carbs: 5, protein: 7, fat: 14, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_walnuts', name: 'Walnuts (1 oz)', calories: 185, carbs: 4, protein: 4, fat: 18, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_popcorn', name: 'Popcorn (3 cups air-popped)', calories: 90, carbs: 18, protein: 3, fat: 1, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '3 cups' },
  { id: 'snack_butterpopcorn', name: 'Butter Popcorn (3 cups)', calories: 160, carbs: 14, protein: 2, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '3 cups' },
  { id: 'snack_pretzels', name: 'Pretzels (1 oz)', calories: 110, carbs: 23, protein: 2, fat: 1, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_potatochips', name: 'Potato Chips (1 oz)', calories: 150, carbs: 15, protein: 2, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_bbqchips', name: 'BBQ Chips (1 oz)', calories: 155, carbs: 16, protein: 2, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_tortillachips', name: 'Tortilla Chips (1 oz)', calories: 140, carbs: 18, protein: 2, fat: 7, category: 'Snacks', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_nachocheesedoritos', name: 'Nacho Cheese Doritos (1 oz)', calories: 150, carbs: 16, protein: 2, fat: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_cheetos', name: 'Cheetos (1 oz)', calories: 160, carbs: 13, protein: 2, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_goldfishcrackers', name: 'Goldfish Crackers (1 oz)', calories: 130, carbs: 20, protein: 3, fat: 5, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_saltinecrackers', name: 'Saltine Crackers (5)', calories: 70, carbs: 12, protein: 1, fat: 2, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '5 crackers' },
  { id: 'snack_ritzcrackers', name: 'Ritz Crackers (5)', calories: 80, carbs: 10, protein: 1, fat: 4, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '5 crackers' },
  { id: 'snack_grahamcrackers', name: 'Graham Crackers (2)', calories: 120, carbs: 21, protein: 2, fat: 3, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '2 crackers' },
  { id: 'snack_peanutbuttercrackers', name: 'Peanut Butter Crackers (6)', calories: 190, carbs: 16, protein: 5, fat: 11, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '6 crackers' },
  { id: 'snack_granolabar', name: 'Granola Bar', calories: 210, carbs: 29, protein: 6, fat: 6, category: 'Snacks', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bar' },
  { id: 'snack_proteinbar', name: 'Protein Bar', calories: 250, carbs: 22, protein: 20, fat: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bar' },
  { id: 'snack_chocolateproteinbar', name: 'Chocolate Protein Bar', calories: 240, carbs: 23, protein: 21, fat: 7, category: 'Snacks', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bar' },
  { id: 'snack_energybar', name: 'Energy Bar', calories: 220, carbs: 28, protein: 10, fat: 7, category: 'Snacks', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bar' },
  { id: 'snack_fruitsnackpack', name: 'Fruit Snack Pack', calories: 80, carbs: 19, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 pack' },
  { id: 'snack_yogurtplain', name: 'Yogurt (plain)', calories: 120, carbs: 16, protein: 8, fat: 3, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_greekyogurt', name: 'Greek Yogurt', calories: 150, carbs: 14, protein: 14, fat: 4, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_greekyogurthoney', name: 'Greek Yogurt with Honey', calories: 180, carbs: 20, protein: 14, fat: 4, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_cottagecheese', name: 'Cottage Cheese (1/2 cup)', calories: 110, carbs: 5, protein: 14, fat: 5, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1/2 cup' },
  { id: 'snack_stringcheese', name: 'String Cheese', calories: 80, carbs: 1, protein: 7, fat: 6, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 stick' },
  { id: 'snack_cheddarcheesecubes', name: 'Cheddar Cheese Cubes (1 oz)', calories: 110, carbs: 0, protein: 7, fat: 9, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_beefjerky', name: 'Beef Jerky (1 oz)', calories: 120, carbs: 3, protein: 12, fat: 7, category: 'Snacks', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_turkeyjerky', name: 'Turkey Jerky (1 oz)', calories: 100, carbs: 3, protein: 12, fat: 5, category: 'Snacks', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_proteinshake', name: 'Protein Shake (bottle)', calories: 180, carbs: 6, protein: 30, fat: 3, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bottle' },
  { id: 'snack_chocolatemilk', name: 'Chocolate Milk (1 cup)', calories: 200, carbs: 28, protein: 8, fat: 5, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_wholemilk', name: 'Whole Milk (1 cup)', calories: 150, carbs: 12, protein: 8, fat: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_2percentmilk', name: '2% Milk (1 cup)', calories: 120, carbs: 12, protein: 8, fat: 5, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_icedcoffeesweetened', name: 'Iced Coffee (sweetened, 12oz)', calories: 180, carbs: 32, protein: 2, fat: 3, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_coldbrewcoffee', name: 'Cold Brew Coffee (black)', calories: 5, carbs: 0, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_latte', name: 'Latte (12oz whole milk)', calories: 190, carbs: 18, protein: 9, fat: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_cappuccino', name: 'Cappuccino (12oz)', calories: 150, carbs: 15, protein: 7, fat: 5, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_mochafrappuccino', name: 'Mocha Frappuccino', calories: 370, carbs: 60, protein: 8, fat: 12, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  { id: 'snack_vanillalatte', name: 'Vanilla Latte', calories: 240, carbs: 38, protein: 9, fat: 6, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_hotchocolate', name: 'Hot Chocolate (12oz)', calories: 230, carbs: 38, protein: 6, fat: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_cola', name: 'Cola (12oz can)', calories: 140, carbs: 39, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_dietcola', name: 'Diet Cola (12oz can)', calories: 2, carbs: 0, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_rootbeer', name: 'Root Beer (12oz can)', calories: 160, carbs: 42, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_gingerale', name: 'Ginger Ale (12oz can)', calories: 130, carbs: 34, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_lemonlimesoda', name: 'Lemon-Lime Soda (12oz can)', calories: 140, carbs: 39, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_orangesoda', name: 'Orange Soda (12oz can)', calories: 150, carbs: 41, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_mountaindew', name: 'Mountain Dew (12oz can)', calories: 170, carbs: 46, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_energydrink', name: 'Energy Drink (Red Bull 8.4oz)', calories: 110, carbs: 27, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '8.4oz' },
  { id: 'snack_sugarfreeenergydrink', name: 'Sugar-Free Energy Drink (8oz)', calories: 10, carbs: 2, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '8oz' },
  { id: 'snack_lemonade', name: 'Lemonade (12oz)', calories: 150, carbs: 38, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysr gb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_icedteasweetened', name: 'Iced Tea (sweetened 12oz)', calories: 120, carbs: 31, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_icedteaunsweetened', name: 'Iced Tea (unsweetened 12oz)', calories: 5, carbs: 1, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_applejuice', name: 'Apple Juice (12oz)', calories: 170, carbs: 42, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_orangejuice', name: 'Orange Juice (12oz)', calories: 160, carbs: 37, protein: 2, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_cranberryjuice', name: 'Cranberry Juice (12oz)', calories: 150, carbs: 38, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_grapejuice', name: 'Grape Juice (12oz)', calories: 190, carbs: 48, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_smoothie', name: 'Smoothie (fruit-based, 12oz)', calories: 280, carbs: 55, protein: 5, fat: 2, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_proteinsmoothie', name: 'Protein Smoothie (12oz)', calories: 250, carbs: 20, protein: 28, fat: 4, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_kombucha', name: 'Kombucha (12oz)', calories: 60, carbs: 14, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_sparklingwater', name: 'Sparkling Water (unsweetened)', calories: 0, carbs: 0, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_flavoredsparklingwater', name: 'Flavored Sparkling Water', calories: 5, carbs: 1, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '12oz' },
  { id: 'snack_applesaucecup', name: 'Apple Sauce Cup', calories: 90, carbs: 22, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_ricecakes', name: 'Rice Cakes (2)', calories: 80, carbs: 16, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '2 cakes' },
  { id: 'snack_poptart', name: 'Pop-Tart', calories: 370, carbs: 70, protein: 5, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '2 pastries' },
  { id: 'snack_chocolatechipcookie', name: 'Chocolate Chip Cookie', calories: 200, carbs: 25, protein: 2, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cookie' },
  { id: 'snack_oatmealraisincookie', name: 'Oatmeal Raisin Cookie', calories: 180, carbs: 24, protein: 3, fat: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cookie' },
  { id: 'snack_browniesquare', name: 'Brownie Square', calories: 240, carbs: 32, protein: 3, fat: 12, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 square' },
  { id: 'snack_cupcake', name: 'Cupcake', calories: 320, carbs: 42, protein: 4, fat: 14, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cupcake' },
  { id: 'snack_candybar', name: 'Candy Bar', calories: 250, carbs: 33, protein: 4, fat: 12, category: 'Snacks', image: 'https://images.unsplash.com/photo-1537200275355-4f0c0714f777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMHdoZWF0JTIwYnJlYWR8ZW58MXx8fHwxNzYyNTU5ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bar' },
  { id: 'snack_darkchocolatesquare', name: 'Dark Chocolate Square', calories: 170, carbs: 16, protein: 2, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_milkchocolatebar', name: 'Milk Chocolate Bar', calories: 210, carbs: 26, protein: 3, fat: 12, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1.5 oz' },
  { id: 'snack_peanutbuttercups', name: 'Peanut Butter Cups', calories: 220, carbs: 24, protein: 4, fat: 12, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '2 cups' },
  { id: 'snack_gummybears', name: 'Gummy Bears (20 pieces)', calories: 160, carbs: 40, protein: 2, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '20 pieces' },
  { id: 'snack_icecream', name: 'Ice Cream (1 cup)', calories: 280, carbs: 32, protein: 5, fat: 14, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_frozenyogurt', name: 'Frozen Yogurt (1 cup)', calories: 230, carbs: 38, protein: 6, fat: 4, category: 'Snacks', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_popsicle', name: 'Popsicle', calories: 90, carbs: 22, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 popsicle' },
  { id: 'snack_fruitrollup', name: 'Fruit Roll-Up', calories: 80, carbs: 20, protein: 0, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 roll' },
  { id: 'snack_trailmixbar', name: 'Trail Mix Bar', calories: 210, carbs: 23, protein: 6, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bar' },
  { id: 'snack_ricekrispiestreat', name: 'Rice Krispies Treat', calories: 160, carbs: 29, protein: 2, fat: 4, category: 'Snacks', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bar' },
  { id: 'snack_caramelpopcorn', name: 'Caramel Popcorn', calories: 200, carbs: 28, protein: 2, fat: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'snack_beefstick', name: 'Beef Stick', calories: 140, carbs: 3, protein: 9, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 stick' },
  { id: 'snack_peanutbutterpack', name: 'Peanut Butter Pack (2 tbsp)', calories: 190, carbs: 7, protein: 8, fat: 16, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '2 tbsp' },
  { id: 'snack_applechips', name: 'Apple Chips (1 oz)', calories: 120, carbs: 30, protein: 1, fat: 0, category: 'Snacks', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_kalechips', name: 'Kale Chips (1 oz)', calories: 110, carbs: 10, protein: 4, fat: 7, category: 'Snacks', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_veggiestraws', name: 'Veggie Straws (1 oz)', calories: 130, carbs: 16, protein: 2, fat: 7, category: 'Snacks', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'snack_hummuspitachips', name: 'Hummus with Pita Chips', calories: 230, carbs: 22, protein: 6, fat: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 serving' },
  
  // Protein sources
  { id: 'chicken', name: 'Chicken Breast', calories: 165, carbs: 0, protein: 31, fat: 3.6, category: 'Protein', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '100g' },
  { id: 'salmon', name: 'Salmon', calories: 206, carbs: 0, protein: 22, fat: 13, category: 'Protein', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '100g' },
  { id: 'tuna', name: 'Tuna (canned)', calories: 116, carbs: 0, protein: 26, fat: 1, category: 'Protein', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDF8fHx8MTc2MjU0NDMxNnww&ixlib=rb-4.1.0&q=80&w=1080', serving: '100g' },
  { id: 'beef', name: 'Lean Beef', calories: 250, carbs: 0, protein: 26, fat: 15, category: 'Protein', image: 'https://images.unsplash.com/photo-1677027201352-3c3981cb8b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWt8ZW58MXx8fHwxNzYyNTkwNDE5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '100g' },
  { id: 'turkey', name: 'Turkey Breast', calories: 135, carbs: 0, protein: 30, fat: 0.7, category: 'Protein', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '100g' },
  { id: 'tofu', name: 'Tofu', calories: 76, carbs: 1.9, protein: 8, fat: 4.8, category: 'Protein', image: 'https://images.unsplash.com/photo-1633096013004-e2cb4023b560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc2MjU4NzMxM3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '100g' },
  
  // Carbs/Grains
  { id: 'rice', name: 'White Rice', calories: 130, carbs: 28, protein: 2.7, fat: 0.3, category: 'Grains', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'brownrice', name: 'Brown Rice', calories: 216, carbs: 45, protein: 5, fat: 1.8, category: 'Grains', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'pasta', name: 'Pasta', calories: 158, carbs: 31, protein: 6, fat: 0.9, category: 'Grains', image: 'https://images.unsplash.com/photo-1704915912479-c3087b9647df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHBsYXRlfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'quinoa', name: 'Quinoa', calories: 222, carbs: 39, protein: 8, fat: 3.6, category: 'Grains', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'potato', name: 'Potato', calories: 163, carbs: 37, protein: 4.3, fat: 0.2, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1665931040985-88ceff0fd38e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlZCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'sweetpotato', name: 'Sweet Potato', calories: 112, carbs: 26, protein: 2, fat: 0.1, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1730815048561-45df6f7f331d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBvdGF0b3xlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  
  // Vegetables
  { id: 'broccoli', name: 'Broccoli', calories: 55, carbs: 11, protein: 3.7, fat: 0.6, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'spinach', name: 'Spinach', calories: 7, carbs: 1.1, protein: 0.9, fat: 0.1, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1706707250982-923e286adc30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDF8fHx8MTc2MjY0ODA1M3ww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'tomato', name: 'Tomato', calories: 22, carbs: 4.8, protein: 1.1, fat: 0.2, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBmcmVzaHxlbnwxfHx8fDE3NjI2NDgwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'carrot', name: 'Carrot', calories: 52, carbs: 12, protein: 1.2, fat: 0.3, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'cucumber', name: 'Cucumber', calories: 16, carbs: 3.6, protein: 0.7, fat: 0.1, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'bellpepper', name: 'Bell Pepper', calories: 39, carbs: 9, protein: 1.5, fat: 0.5, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1748792818634-a098347e540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NjI2NDgwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  
  // Fruits
  { id: 'apple', name: 'Apple', calories: 95, carbs: 25, protein: 0.5, fat: 0.3, category: 'Fruits', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'orange', name: 'Orange', calories: 62, carbs: 15, protein: 1.2, fat: 0.2, category: 'Fruits', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'strawberry', name: 'Strawberries', calories: 49, carbs: 12, protein: 1, fat: 0.5, category: 'Fruits', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'blueberry', name: 'Blueberries', calories: 84, carbs: 21, protein: 1.1, fat: 0.5, category: 'Fruits', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'grapes', name: 'Grapes', calories: 104, carbs: 27, protein: 1.1, fat: 0.2, category: 'Fruits', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'watermelon', name: 'Watermelon', calories: 46, carbs: 11, protein: 0.9, fat: 0.2, category: 'Fruits', image: 'https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXxlbnwxfHx8fDE3NjI2MjAwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  
  // Nuts & Seeds
  { id: 'almonds', name: 'Almonds', calories: 164, carbs: 6, protein: 6, fat: 14, category: 'Nuts', image: 'https://images.unsplash.com/photo-1669219510558-56d14e7927b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG1vbmRzJTIwbnV0c3xlbnwxfHx8fDE3NjI1ODQwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'walnuts', name: 'Walnuts', calories: 185, carbs: 4, protein: 4.3, fat: 18.5, category: 'Nuts', image: 'https://images.unsplash.com/photo-1669219510558-56d14e7927b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG1vbmRzJTIwbnV0c3xlbnwxfHx8fDE3NjI1ODQwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'cashews', name: 'Cashews', calories: 157, carbs: 9, protein: 5, fat: 12, category: 'Nuts', image: 'https://images.unsplash.com/photo-1669219510558-56d14e7927b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG1vbmRzJTIwbnV0c3xlbnwxfHx8fDE3NjI1ODQwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'chiaseeds', name: 'Chia Seeds', calories: 138, carbs: 12, protein: 4.7, fat: 8.7, category: 'Seeds', image: 'https://images.unsplash.com/photo-1669219510558-56d14e7927b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG1vbmRzJTIwbnV0c3xlbnwxfHx8fDE3NjI1ODQwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  
  // Dairy
  { id: 'milk', name: 'Milk (2%)', calories: 122, carbs: 12, protein: 8, fat: 4.8, category: 'Dairy', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'cheese', name: 'Cheddar Cheese', calories: 114, carbs: 0.4, protein: 7, fat: 9, category: 'Dairy', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'cottagecheese', name: 'Cottage Cheese', calories: 81, carbs: 3, protein: 14, fat: 1.2, category: 'Dairy', image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc2MjYwNzM1OXww&ixlib=rb-4.1.0&q=80&w=1080', serving: '1/2 cup' },
  
  // Fats & Oils
  { id: 'avocado', name: 'Avocado', calories: 234, carbs: 12, protein: 2.9, fat: 21, category: 'Fats', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 medium' },
  { id: 'oliveoil', name: 'Olive Oil', calories: 119, carbs: 0, protein: 0, fat: 13.5, category: 'Fats', image: 'https://images.unsplash.com/photo-1758279745324-ff5ed34200a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZnxlbnwxfHx8fDE3NjI2NDgwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 tbsp' },
  { id: 'butter', name: 'Butter', calories: 102, carbs: 0, protein: 0.1, fat: 11.5, category: 'Fats', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 tbsp' },
  
  // Legumes
  { id: 'blackbeans', name: 'Black Beans', calories: 227, carbs: 41, protein: 15, fat: 0.9, category: 'Legumes', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'chickpeas', name: 'Chickpeas', calories: 269, carbs: 45, protein: 14.5, fat: 4.3, category: 'Legumes', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'lentils', name: 'Lentils', calories: 230, carbs: 40, protein: 18, fat: 0.8, category: 'Legumes', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  
  // Snacks
  { id: 'proteinbar', name: 'Protein Bar', calories: 200, carbs: 24, protein: 20, fat: 5, category: 'Snacks', image: 'https://images.unsplash.com/photo-1669219510558-56d14e7927b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG1vbmRzJTIwbnV0c3xlbnwxfHx8fDE3NjI1ODQwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 bar' },
  { id: 'granola', name: 'Granola', calories: 149, carbs: 16, protein: 4.4, fat: 7.7, category: 'Snacks', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1/3 cup' },
  { id: 'popcorn', name: 'Popcorn (air-popped)', calories: 31, carbs: 6, protein: 1, fat: 0.4, category: 'Snacks', image: 'https://images.unsplash.com/photo-1610406765661-57646c40da59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXRtZWFsJTIwYm93bHxlbnwxfHx8fDE3NjI2NDgwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 cup' },
  { id: 'darkchocolate', name: 'Dark Chocolate', calories: 155, carbs: 17, protein: 1.4, fat: 9, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621634890180-0b93f32e10bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3ZWRnZXxlbnwxfHx8fDE3NjI2NDgwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1 oz' },
  { id: 'hummus', name: 'Hummus', calories: 102, carbs: 12, protein: 3, fat: 5, category: 'Snacks', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHJpY2V8ZW58MXx8fHwxNzYyNjQ4MDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080', serving: '1/4 cup' },
];

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface AddedFood extends FoodItem {
  quantity: number;
}

interface Meals {
  breakfast: AddedFood[];
  lunch: AddedFood[];
  dinner: AddedFood[];
  snacks: AddedFood[];
}

interface DietTabProps {
  caloriesBurned: number;
}

export function DietTab({ caloriesBurned }: DietTabProps) {
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [totalGlasses, setTotalGlasses] = useState(8);
  const [meals, setMeals] = useState<Meals>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Diet variables
  const [bmr] = useState(1800);
  const [activityMultiplier, setActivityMultiplier] = useState(1.55);
  const [goalDeltaPerDay, setGoalDeltaPerDay] = useState(0);
  const [targetCalories, setTargetCalories] = useState(0);
  const [caloriesLeft, setCaloriesLeft] = useState(0);
  
  // Display values for dropdowns
  const [goalSelection, setGoalSelection] = useState("0");
  const [activitySelection, setActivitySelection] = useState("1.55");

  const litersPerGlass = 0.25;

  // Calculate totals from all meals
  const totalCalories = Object.values(meals)
    .flat()
    .reduce((sum, food) => sum + food.calories * food.quantity, 0);

  const totalCarbs = Object.values(meals)
    .flat()
    .reduce((sum, food) => sum + food.carbs * food.quantity, 0);

  const totalProtein = Object.values(meals)
    .flat()
    .reduce((sum, food) => sum + food.protein * food.quantity, 0);

  const totalFat = Object.values(meals)
    .flat()
    .reduce((sum, food) => sum + food.fat * food.quantity, 0);

  // Recalculation logic - runs whenever dependencies change
  useEffect(() => {
    // Calculate target calories
    const calculatedTarget = Math.round(bmr * activityMultiplier + goalDeltaPerDay);
    
    // Apply safety clamp for weight loss goals
    const clampedTarget = goalDeltaPerDay < 0 ? Math.max(calculatedTarget, 1200) : calculatedTarget;
    setTargetCalories(clampedTarget);
    
    // Calculate calories left
    const calculatedLeft = Math.round(clampedTarget - totalCalories + caloriesBurned);
    setCaloriesLeft(calculatedLeft);
  }, [bmr, activityMultiplier, goalDeltaPerDay, totalCalories, caloriesBurned]);

  const percentEaten = totalCalories > 0 && targetCalories > 0 ? (totalCalories / targetCalories) * 100 : 0;

  const macros = [
    { name: 'Carbs', current: Math.round(totalCarbs), total: 380, color: 'bg-orange-500', progress: totalCarbs > 0 ? (totalCarbs / 380) * 100 : 0 },
    { name: 'Protein', current: Math.round(totalProtein), total: 152, color: 'bg-blue-500', progress: totalProtein > 0 ? (totalProtein / 152) * 100 : 0 },
    { name: 'Fat', current: Math.round(totalFat), total: 101, color: 'bg-purple-500', progress: totalFat > 0 ? (totalFat / 101) * 100 : 0 },
  ];

  // Filter foods based on search
  const filteredFoods = foodDatabase.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleGlass = (index: number) => {
    if (index < waterGlasses) {
      const newWaterGlasses = index;
      setWaterGlasses(newWaterGlasses);

      let newTotal = totalGlasses;
      while (newTotal > 8 && newWaterGlasses < newTotal - 8) {
        newTotal -= 8;
      }
      if (newTotal !== totalGlasses) {
        setTotalGlasses(newTotal);
      }
    } else {
      const newWaterGlasses = index + 1;
      setWaterGlasses(newWaterGlasses);

      if (newWaterGlasses >= totalGlasses && (newWaterGlasses * litersPerGlass) % 2.0 === 0) {
        setTotalGlasses(totalGlasses + 8);
      }
    }
  };

  const openAddFoodModal = (mealType: MealType) => {
    setSelectedMeal(mealType);
    setSelectedFoods({});
    setSearchQuery('');
    setShowFoodModal(true);
  };

  const toggleFoodSelection = (foodId: string) => {
    setSelectedFoods(prev => {
      const newSelected = { ...prev };
      if (foodId in newSelected) {
        delete newSelected[foodId];
      } else {
        newSelected[foodId] = 1;
      }
      return newSelected;
    });
  };

  const updateFoodQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedFoods(prev => {
        const newSelected = { ...prev };
        delete newSelected[foodId];
        return newSelected;
      });
    } else {
      setSelectedFoods(prev => ({
        ...prev,
        [foodId]: quantity,
      }));
    }
  };

  const addFoodsToMeal = () => {
    if (!selectedMeal || Object.keys(selectedFoods).length === 0) return;

    const foodsToAdd = Object.entries(selectedFoods).map(([id, quantity]) => {
      const food = foodDatabase.find(f => f.id === id);
      if (!food) return null;
      
      // Check if food already exists in meal
      const existingFood = meals[selectedMeal].find(f => f.id === id);
      if (existingFood) {
        return { ...food, quantity: existingFood.quantity + quantity };
      }
      return { ...food, quantity };
    }).filter(Boolean) as AddedFood[];

    setMeals(prev => {
      const updatedMeal = [...prev[selectedMeal]];
      
      foodsToAdd.forEach(newFood => {
        const existingIndex = updatedMeal.findIndex(f => f.id === newFood.id);
        if (existingIndex >= 0) {
          updatedMeal[existingIndex] = newFood;
        } else {
          updatedMeal.push(newFood);
        }
      });

      return {
        ...prev,
        [selectedMeal]: updatedMeal,
      };
    });

    setShowFoodModal(false);
    setSelectedFoods({});
  };

  const removeFoodFromMeal = (mealType: MealType, foodId: string) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(food => food.id !== foodId),
    }));
  };

  const getMealTotal = (mealType: MealType) => {
    const mealFoods = meals[mealType];
    return {
      calories: mealFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0),
      carbs: mealFoods.reduce((sum, food) => sum + food.carbs * food.quantity, 0),
      protein: mealFoods.reduce((sum, food) => sum + food.protein * food.quantity, 0),
      fat: mealFoods.reduce((sum, food) => sum + food.fat * food.quantity, 0),
    };
  };

  const renderMealCard = (mealType: MealType, title: string, icon: string) => {
    const mealFoods = meals[mealType];
    const mealTotal = getMealTotal(mealType);

    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <h3 className="text-gray-900 dark:text-gray-100">{title}</h3>
            </div>
            <button
              onClick={() => openAddFoodModal(mealType)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>

          {mealFoods.length > 0 ? (
            <>
              <div className="space-y-2 mb-3">
                {mealFoods.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    {food.image && (
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                        <ImageWithFallback
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {food.name} {food.quantity > 1 && `x${food.quantity}`}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {Math.round(food.calories * food.quantity)} cal • C: {Math.round(food.carbs * food.quantity)}g • P: {Math.round(food.protein * food.quantity)}g • F: {Math.round(food.fat * food.quantity)}g
                      </div>
                    </div>
                    <button
                      onClick={() => removeFoodFromMeal(mealType, food.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Total: {Math.round(mealTotal.calories)} cal • C: {Math.round(mealTotal.carbs)}g • P: {Math.round(mealTotal.protein)}g • F: {Math.round(mealTotal.fat)}g
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No foods added yet
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="pb-24">
      {/* Gradient Header with Calorie Circle */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-800 text-white px-6 pt-6 pb-8">
        {/* Calorie Circle */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Eaten */}
          <div className="text-center w-16">
            <div className="text-2xl transition-all duration-500 ease-out tabular-nums">{Math.round(totalCalories)}</div>
            <div className="text-xs text-white/80">EATEN</div>
          </div>

          {/* Circle Progress */}
          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="white"
                strokeWidth="8"
                fill="none"
                opacity="0.3"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(percentEaten / 100) * 440} 440`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl transition-all duration-500 ease-out tabular-nums">{Math.round(caloriesLeft)}</div>
              <div className="text-xs text-white/80">KCAL LEFT</div>
            </div>
          </div>

          {/* Burned */}
          <div className="text-center w-16">
            <div className="text-2xl transition-all duration-500 ease-out tabular-nums">{caloriesBurned}</div>
            <div className="text-xs text-white/80">BURNED</div>
          </div>
        </div>
      </div>

      {/* Diet Settings Dropdowns */}
      <div className="px-4 -mt-6 mb-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Goal Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600 dark:text-gray-400">Goal</label>
                <Select 
                  value={goalSelection} 
                  onValueChange={(value) => {
                    setGoalSelection(value);
                    setGoalDeltaPerDay(Number(value));
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Maintain weight</SelectItem>
                    <SelectItem value="-250">Mild loss (0.5 lb/week)</SelectItem>
                    <SelectItem value="-500">Weight loss (1 lb/week)</SelectItem>
                    <SelectItem value="-1000">Extreme loss (2 lb/week)</SelectItem>
                    <SelectItem value="250">Mild gain (0.5 lb/week)</SelectItem>
                    <SelectItem value="500">Weight gain (1 lb/week)</SelectItem>
                    <SelectItem value="1000">Extreme gain (2 lb/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Activity Level Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600 dark:text-gray-400">Activity Level</label>
                <Select 
                  value={activitySelection} 
                  onValueChange={(value) => {
                    setActivitySelection(value);
                    setActivityMultiplier(Number(value));
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.00">BMR</SelectItem>
                    <SelectItem value="1.20">Sedentary</SelectItem>
                    <SelectItem value="1.375">Light (1-3x/week)</SelectItem>
                    <SelectItem value="1.55">Moderate (4-5x/week)</SelectItem>
                    <SelectItem value="1.725">Active (daily)</SelectItem>
                    <SelectItem value="1.90">Very Active (6-7x/week)</SelectItem>
                    <SelectItem value="2.00">Extra Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Daily Target Display */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Daily Target: <span className="text-gray-900 dark:text-gray-100 tabular-nums">{targetCalories}</span> kcal
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Macros Card */}
      <div className="px-4 mb-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {macros.map((macro) => (
                <div key={macro.name} className="space-y-2">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{macro.name}</div>
                  <Progress value={macro.progress} className="h-2 transition-all duration-700 ease-out" />
                  <div className="text-xs text-gray-600 dark:text-gray-400 transition-all duration-500 ease-out tabular-nums">
                    {macro.current} / {macro.total}g
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Cards */}
      <div className="px-4 space-y-3">
        {renderMealCard('breakfast', 'Breakfast', '🍳')}
        {renderMealCard('lunch', 'Lunch', '🥗')}
        {renderMealCard('dinner', 'Dinner', '🍽️')}
        {renderMealCard('snacks', 'Snacks', '🍎')}

        {/* Water Tracker */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 mt-3">
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="text-gray-900 dark:text-gray-100">
                Water ({(waterGlasses * litersPerGlass).toFixed(1)} L)
              </h3>
            </div>

            {/* Water Glasses */}
            <div className="space-y-3">
              {Array.from({ length: Math.ceil(totalGlasses / 8) }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex items-end justify-between gap-2">
                  {Array.from({ length: 8 }).map((_, colIndex) => {
                    const index = rowIndex * 8 + colIndex;
                    if (index >= totalGlasses) return null;

                    const isFilled = index < waterGlasses;
                    const isFirstEmpty = !isFilled && (index === 0 || index === waterGlasses);

                    return (
                      <button
                        key={index}
                        onClick={() => toggleGlass(index)}
                        className="flex-1 relative group"
                      >
                        {/* Glass Container */}
                        <div className="relative h-20 w-full flex items-end justify-center">
                          {/* Add button in lower part of first empty glass */}
                          {isFirstEmpty && (
                            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newWaterGlasses = waterGlasses + 1;
                                  setWaterGlasses(newWaterGlasses);

                                  if (newWaterGlasses >= totalGlasses && (newWaterGlasses * litersPerGlass) % 2.0 === 0) {
                                    setTotalGlasses(totalGlasses + 8);
                                  }
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-blue-500 dark:border-blue-400 bg-white/90 dark:bg-gray-800/90 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                              </div>
                            </div>
                          )}

                          {/* Glass Shape */}
                          <svg
                            viewBox="0 0 50 70"
                            className="w-full h-16"
                            preserveAspectRatio="none"
                          >
                            <defs>
                              <linearGradient id={`glassShine${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                                <stop offset="30%" stopColor="white" stopOpacity="0.3" />
                                <stop offset="70%" stopColor="white" stopOpacity="0.05" />
                                <stop offset="100%" stopColor="white" stopOpacity="0.2" />
                              </linearGradient>

                              <linearGradient id={`waterGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
                                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
                              </linearGradient>

                              <linearGradient id={`waterSurface${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.6" />
                                <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.6" />
                              </linearGradient>
                            </defs>

                            <path
                              d="M 10 5 L 40 5 L 37 70 L 13 70 Z"
                              fill={isFilled ? `url(#glassShine${index})` : 'rgba(229, 243, 255, 0.3)'}
                              className="dark:fill-gray-700/30"
                            />

                            {isFilled && (
                              <g className="animate-in fade-in duration-[1500ms]">
                                <path
                                  d="M 10 5 L 40 5 L 37 70 L 13 70 Z"
                                  fill={`url(#waterGradient${index})`}
                                  className="transition-all duration-[1500ms] ease-out"
                                />
                                <ellipse
                                  cx="25"
                                  cy="7"
                                  rx="15"
                                  ry="2"
                                  fill={`url(#waterSurface${index})`}
                                  className="animate-in fade-in duration-[1500ms]"
                                />
                              </g>
                            )}

                            <path
                              d="M 10 5 L 40 5 L 37 70 L 13 70 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className={isFilled ? 'text-blue-400/60 dark:text-blue-500/60' : 'text-gray-300 dark:text-gray-600'}
                              strokeLinejoin="round"
                            />

                            <line
                              x1="10"
                              y1="5"
                              x2="40"
                              y2="5"
                              stroke="white"
                              strokeWidth="1.5"
                              opacity="0.5"
                            />
                          </svg>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Food Modal */}
      <Dialog open={showFoodModal} onOpenChange={setShowFoodModal}>
        <DialogContent className="max-w-md h-[600px] flex flex-col dark:bg-gray-800 dark:border-gray-700 p-6">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Add Food</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Search and select foods to add to your meal
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* Food List */}
          <ScrollArea className="flex-1 mt-4 -mx-6 px-6 min-h-0">
            <div className="space-y-2 py-2 pr-4">
              {filteredFoods.map((food) => {
                const isSelected = food.id in selectedFoods;
                const quantity = selectedFoods[food.id] || 1;

                return (
                  <div
                    key={food.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleFoodSelection(food.id)}
                      className="flex-shrink-0"
                    />

                    <div 
                      onClick={() => !isSelected && toggleFoodSelection(food.id)}
                      className={`flex items-center gap-3 flex-1 min-w-0 ${!isSelected ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{food.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {food.calories} cal • C: {food.carbs}g • P: {food.protein}g • F: {food.fat}g
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">{food.serving}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateFoodQuantity(food.id, quantity - 1);
                          }}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            updateFoodQuantity(food.id, val);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 h-8 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateFoodQuantity(food.id, quantity + 1);
                          }}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Add Button */}
          <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowFoodModal(false)}
              className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={addFoodsToMeal}
              disabled={Object.keys(selectedFoods).length === 0}
              className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Meal {Object.keys(selectedFoods).length > 0 && `(${Object.keys(selectedFoods).length})`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
