import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Database, ArrowUpDown, Search, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { FoodEntry } from '../types';

function DataView() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof FoodEntry>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    setDeleteLoading(id);
    try {
      const { data, error, count } = await supabase
      .from('food_entries')
      .delete({ returning: 'minimal' })
      .eq('id', id);
      console.log('data: ', data);

      console.log(`Attempted to delete entry with ID: ${id}. Rows deleted: ${count}`);

      if (error) throw error;

      if (count === 0) {
        alert('No entry was deleted. Please check the ID or permissions.');
      } else {
        await fetchEntries();
        alert('Entry deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Error deleting entry. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSort = (field: keyof FoodEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedEntries = entries
    .filter((entry) =>
      entry.food_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.meal_type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  const getWasteClass = (wastePercentage: string | number) => {
    if (wastePercentage === 'N/A') return 'bg-gray-100 text-gray-600';
    const value = typeof wastePercentage === 'string' ? parseFloat(wastePercentage) : wastePercentage;
    if (value > 50) return 'bg-red-100 text-red-600';
    if (value > 25) return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Food Waste Data</h1>
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['date', 'meal_type', 'food_item', 'initial_weight', 'remaining_weight'].map((field) => (
                  <th
                    key={field}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(field as keyof FoodEntry)}
                  >
                    <div className="flex items-center">
                      {field.replace('_', ' ').toUpperCase()}
                      {sortField === field && <ArrowUpDown className="ml-1 h-4 w-4" />}
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waste %
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedEntries.length > 0 ? (
                filteredAndSortedEntries.map((entry) => {
                  const wastePercentage = entry.remaining_weight !== null
                    ? ((entry.remaining_weight / entry.initial_weight) * 100).toFixed(1)
                    : 'N/A';

                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(entry.date), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{entry.meal_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.food_item}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.initial_weight} kg</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.remaining_weight !== null ? `${entry.remaining_weight} kg` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${getWasteClass(wastePercentage)}`}>
                          {wastePercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleteLoading === entry.id}
                          className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Delete entry"
                        >
                          {deleteLoading === entry.id ? (
                            <div className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    {searchTerm ? 'No matching entries found' : 'No entries available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredAndSortedEntries.length}</span> entries
            {searchTerm && <span> (filtered from {entries.length} total)</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataView;
