import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PetCard = ({ pet, onAddToCart }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="pet-card card">
      <div className="relative h-48 w-full">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=500';
          }}
        />
        {pet.status === 'sold' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            Sold
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
          <span className="text-lg font-bold text-primary-600">
            ${pet.price.toLocaleString()}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Species:</span>
            {pet.species}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Breed:</span>
            {pet.breed}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Age:</span>
            {pet.age} years
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {pet.description}
        </p>

        <div className="mt-4 flex items-center space-x-2">
          <Link
            to={`/pets/${pet._id}`}
            className="btn btn-secondary flex-1 text-center"
          >
            View Details
          </Link>
          
          {isAuthenticated && pet.status !== 'sold' && (
            <button
              onClick={() => onAddToCart(pet._id)}
              className="btn btn-primary flex-1"
              disabled={pet.status === 'sold'}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
