import React, { useState, useEffect } from 'react';

const SearchBar = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [species] = useState([
    'Dog',
    'Cat',
    'Bird',
    'Fish',
    'Rabbit',
    'Hamster',
    'Other'
  ]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      species: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={localFilters.search}
            onChange={handleInputChange}
            placeholder="Search by name, breed..."
            className="input"
          />
        </div>

        {/* Species Select */}
        <div>
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
            Species
          </label>
          <select
            id="species"
            name="species"
            value={localFilters.species}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">All Species</option>
            {species.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price ($)
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={localFilters.minPrice}
              onChange={handleInputChange}
              placeholder="Min price"
              min="0"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price ($)
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={localFilters.maxPrice}
              onChange={handleInputChange}
              placeholder="Max price"
              min="0"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-secondary"
        >
          Clear Filters
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
