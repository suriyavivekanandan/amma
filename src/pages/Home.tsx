import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ClipboardList, Database, Calendar, Leaf, Users, Truck, BarChart } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center bg-green-100 rounded-2xl p-12 shadow-lg">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to Food Waste Management
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Track, manage, and reduce food waste efficiently
        </p>
        <Link
          to="/initial-weight"
          className="bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-700 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-16">
        <Link
          to="/initial-weight"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Scale className="h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initial Entry</h2>
          <p className="text-gray-600">Record initial weight and details of food items</p>
        </Link>

        <Link
          to="/remaining-weight"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <ClipboardList className="h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Remaining Entry</h2>
          <p className="text-gray-600">Update remaining weights and track wastage</p>
        </Link>

        <Link
          to="/data"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Database className="h-12 w-12 text-purple-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data View</h2>
          <p className="text-gray-600">Analyze food waste data and trends</p>
        </Link>

        <Link
          to="/food-analysis"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <BarChart className="h-12 w-12 text-orange-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Food Analysis</h2>
          <p className="text-gray-600">Visualize waste patterns and get recommendations</p>
        </Link>

        <Link
          to="/booking"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Calendar className="h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bookings</h2>
          <p className="text-gray-600">Manage trust bookings for remaining food</p>
        </Link>
      </div>

      {/* How It Works Section */}
      <div className="mt-16 bg-yellow-50 rounded-lg p-8 shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <Scale className="h-14 w-14 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Record</h3>
            <p className="text-gray-600">Log the initial weight of food prepared daily.</p>
          </div>
          <div className="text-center">
            <ClipboardList className="h-14 w-14 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track</h3>
            <p className="text-gray-600">Monitor remaining food to understand wastage patterns.</p>
          </div>
          <div className="text-center">
            <BarChart className="h-14 w-14 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyze</h3>
            <p className="text-gray-600">Get insights and recommendations to reduce waste.</p>
          </div>
          <div className="text-center">
            <Truck className="h-14 w-14 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribute</h3>
            <p className="text-gray-600">Book pickups for leftover food with local trusts.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="text-gray-700 italic mb-4">
              "This system helped us cut down food waste by 40% and supported local charities. Easy to use and impactful!"
            </p>
            <p className="text-gray-900 font-semibold">- Rajesh Kumar, Hostel Warden</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="text-gray-700 italic mb-4">
              "An amazing initiative that ensures no food goes to waste. The booking system works seamlessly."
            </p>
            <p className="text-gray-900 font-semibold">- Asha Trust, Chennai</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 bg-gray-800 text-gray-300 py-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/initial-weight" className="hover:underline">Initial Weight</Link></li>
              <li><Link to="/remaining-weight" className="hover:underline">Remaining Weight</Link></li>
              <li><Link to="/food-analysis" className="hover:underline">Food Analysis</Link></li>
              <li><Link to="/data" className="hover:underline">Data View</Link></li>
              <li><Link to="/booking" className="hover:underline">Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
            <p>Email: support@foodwastemgmt.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Follow Us</h3>
            <p>Instagram | Twitter | Facebook</p>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-8">&copy; 2025 Food Waste Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;