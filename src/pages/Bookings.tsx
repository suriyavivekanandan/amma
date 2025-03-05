import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { FoodEntry, Booking } from '../types';

interface BookingFormData {
  person_name: string;
  contact_number: string;
  trust_name: string;
}

function Bookings() {
  const [availableFood, setAvailableFood] = useState<FoodEntry[]>([]);
  const [bookings, setBookings] = useState<(Booking & { food_entry: FoodEntry })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<FoodEntry | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    person_name: '',
    contact_number: '',
    trust_name: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch available food (with remaining weight > 0)
      const { data: foodData, error: foodError } = await supabase
        .from('food_entries')
        .select('*')
        .gt('remaining_weight', 0)
        .order('date', { ascending: false });

      if (foodError) throw foodError;

      // Fetch existing bookings with food entry details
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*, food_entry:food_entries(*)')
        .order('booking_date', { ascending: false });

      if (bookingError) throw bookingError;

      setAvailableFood(foodData || []);
      setBookings(bookingData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          food_entry_id: selectedEntry.id,
          ...formData,
        });

      if (error) throw error;

      // Reset form and refresh data
      setSelectedEntry(null);
      setFormData({
        person_name: '',
        contact_number: '',
        trust_name: '',
      });
      await fetchData();
      alert('Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Calendar className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900">Food Bookings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Food Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Food</h2>
          {availableFood.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No food available for booking at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {availableFood.map((entry) => (
                <div
                  key={entry.id}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-colors ${
                    selectedEntry?.id === entry.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{entry.food_item}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(entry.date), 'MMMM d, yyyy')} - {entry.meal_type}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                      {entry.remaining_weight} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Form Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Booking</h2>
          {selectedEntry ? (
            <form onSubmit={handleBooking} className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Person Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.person_name}
                    onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trust Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.trust_name}
                    onChange={(e) => setFormData({ ...formData, trust_name: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Booking
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">Select an available food item to create a booking.</p>
            </div>
          )}

          {/* Bookings List */}
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Recent Bookings</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Food Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trust
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.food_entry.food_item}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.trust_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(booking.booking_date), 'MMM d, yyyy h:mm a')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;