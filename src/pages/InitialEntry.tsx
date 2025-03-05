import React, { useState } from 'react';
import { format } from 'date-fns';
import { Scale, Plus, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchWeightFromESP } from '../lib/esp8266';
import { MealType, FOOD_ITEMS } from '../types';

interface FoodEntryForm {
  food_item: string;
  initial_weight: string;
}

function InitialEntry() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [entries, setEntries] = useState<FoodEntryForm[]>([{ food_item: FOOD_ITEMS[0], initial_weight: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);

  const handleAddDish = () => {
    setEntries([...entries, { food_item: FOOD_ITEMS[0], initial_weight: '' }]);
  };

  const handleRemoveDish = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleEntryChange = (index: number, field: keyof FoodEntryForm, value: string) => {
    const newEntries = [...entries];
    if (field === 'initial_weight') {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        newEntries[index] = { ...newEntries[index], [field]: value };
      }
    } else {
      newEntries[index] = { ...newEntries[index], [field]: value };
    }
    setEntries(newEntries);
  };

  const handleFetchWeight = async (index: number) => {
    setIsFetching(true);
    setSelectedEntryIndex(index);

    try {
      const weight = await fetchWeightFromESP();
      const newEntries = [...entries];
      newEntries[index] = { ...newEntries[index], initial_weight: weight.toString() };
      setEntries(newEntries);
    } catch (error) {
      console.error('Error fetching weight:', error);
      alert('Failed to fetch weight from sensor. Please try again or enter manually.');
    } finally {
      setIsFetching(false);
      setSelectedEntryIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const foodEntries = entries.map(entry => ({
        date,
        meal_type: mealType,
        food_item: entry.food_item,
        initial_weight: parseFloat(entry.initial_weight) || 0,
      }));

      const { error } = await supabase.from('food_entries').insert(foodEntries);
      if (error) throw error;

      setEntries([{ food_item: FOOD_ITEMS[0], initial_weight: '' }]);
      alert('Food entries saved successfully!');
    } catch (error) {
      console.error('Error saving food entries:', error);
      alert('Error saving food entries. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <Scale className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Initial Weight Entry</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Item</label>
                  <select
                    value={entry.food_item}
                    onChange={(e) => handleEntryChange(index, 'food_item', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    {FOOD_ITEMS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Weight (kg)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      pattern="^\d*\.?\d*$"
                      value={entry.initial_weight}
                      onChange={(e) => handleEntryChange(index, 'initial_weight', e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleFetchWeight(index)}
                      disabled={isFetching && selectedEntryIndex === index}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                    >
                      <RefreshCw className={`h-5 w-5 ${isFetching && selectedEntryIndex === index ? 'animate-spin' : ''}`} />
                      <span className="ml-1">{isFetching && selectedEntryIndex === index ? 'Fetching...' : 'Fetch'}</span>
                    </button>
                  </div>
                </div>

                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDish(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleAddDish}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Another Dish
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Entries'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InitialEntry;
