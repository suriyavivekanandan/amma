import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Scale, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchWeightFromESP } from '../lib/esp8266';
import type { FoodEntry } from '../types';

function RemainingEntry() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .is('remaining_weight', null)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      alert('Error loading entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWeight = async (id: string, remainingWeight: number) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('food_entries')
        .update({ remaining_weight: remainingWeight })
        .eq('id', id);

      if (error) throw error;
      await fetchEntries();
    } catch (error) {
      console.error('Error updating remaining weight:', error);
      alert('Error updating remaining weight. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const handleFetchWeight = async (entryId: string) => {
    setIsFetching(true);
    setSelectedEntryId(entryId);
    try {
      const weight = await fetchWeightFromESP();
      await handleUpdateWeight(entryId, weight);
    } catch (error) {
      console.error('Error fetching weight:', error);
      alert('Failed to fetch weight from sensor. Please try again or enter manually.');
    } finally {
      setIsFetching(false);
      setSelectedEntryId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Pending Entries</h3>
        <p className="mt-1 text-sm text-gray-500">There are no food entries that need remaining weight updates.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Scale className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900">Remaining Weight Entry</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{entry.food_item}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(entry.date), 'MMMM d, yyyy')} - {entry.meal_type}
                </p>
              </div>
              <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                {entry.initial_weight} kg
              </span>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Weight (kg)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={entry.initial_weight}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter remaining weight"
                  disabled={updating === entry.id || isFetching}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      handleUpdateWeight(entry.id, parseFloat(target.value));
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleFetchWeight(entry.id)}
                  disabled={isFetching && selectedEntryId === entry.id}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                >
                  <RefreshCw className={`h-5 w-5 ${isFetching && selectedEntryId === entry.id ? 'animate-spin' : ''}`} />
                  <span className="ml-1">Fetch</span>
                </button>
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement;
                    handleUpdateWeight(entry.id, parseFloat(input.value));
                  }}
                  disabled={updating === entry.id || isFetching}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {updating === entry.id ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RemainingEntry;
