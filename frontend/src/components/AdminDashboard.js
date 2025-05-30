import React, { useState, useEffect } from 'react';
import { petService, handleApiError } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    price: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await petService.getAllPets();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      price: '',
      description: '',
      imageUrl: '',
    });
    setSelectedPet(null);
  };

  const openModal = (pet = null) => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        price: pet.price,
        description: pet.description,
        imageUrl: pet.imageUrl,
      });
      setSelectedPet(pet);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPet) {
        await petService.updatePet(selectedPet._id, formData);
        toast.success('Pet updated successfully');
      } else {
        await petService.createPet(formData);
        toast.success('Pet created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchPets();
    } catch (err) {
      const errorData = handleApiError(err);
      toast.error(errorData.message);
    }
  };

  const handleDelete = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await petService.deletePet(petId);
        toast.success('Pet deleted successfully');
        fetchPets();
      } catch (err) {
        const errorData = handleApiError(err);
        toast.error(errorData.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pet Management</h2>
        <button
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          Add New Pet
        </button>
      </div>

      {/* Pet List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pets.map((pet) => (
              <tr key={pet._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={pet.imageUrl}
                        alt={pet.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=500';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {pet.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{pet.species}</div>
                  <div className="text-sm text-gray-500">{pet.breed}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${pet.price.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pet.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {pet.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openModal(pet)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pet._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedPet ? 'Edit Pet' : 'Add New Pet'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Species</label>
                <input
                  type="text"
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  required
                  className="input mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  required
                  className="input mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="input mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="input mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="input mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                  className="input mt-1"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {selectedPet ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
