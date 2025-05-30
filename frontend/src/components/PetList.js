import React, { useState, useEffect } from 'react';
import { petService, cartService, handleApiError } from '../services/api';
import PetCard from './PetCard';
import SearchBar from './SearchBar';
import { toast } from 'react-toastify';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    species: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await petService.getAllPets(filters);
      setPets(data);
      setError(null);
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      toast.error(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAddToCart = async (petId) => {
    try {
      await cartService.addToCart(petId, 1);
      toast.success('Pet added to cart successfully!');
    } catch (err) {
      const errorData = handleApiError(err);
      toast.error(errorData.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchPets}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-600">
            No pets found matching your criteria
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PetList;
