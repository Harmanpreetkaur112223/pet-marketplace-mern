const Pet = require('../models/Pet');

// @desc    Get all pets with filters
// @route   GET /api/pets
// @access  Public
const getPets = async (req, res) => {
  try {
    const { species, breed, minPrice, maxPrice, search } = req.query;
    let query = {};

    // Apply filters if they exist
    if (species) query.species = species;
    if (breed) query.breed = breed;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const pets = await Pet.find(query)
      .populate('seller', 'username email')
      .sort({ createdAt: -1 });

    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('seller', 'username email');

    if (pet) {
      res.json(pet);
    } else {
      res.status(404);
      throw new Error('Pet not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a pet
// @route   POST /api/pets
// @access  Private/Admin
const createPet = async (req, res) => {
  try {
    const { name, species, breed, age, price, description, imageUrl } = req.body;

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      price,
      description,
      imageUrl,
      seller: req.user._id,
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
const updatePet = async (req, res) => {
  try {
    const { name, species, breed, age, price, description, imageUrl, status } = req.body;

    const pet = await Pet.findById(req.params.id);

    if (pet) {
      pet.name = name || pet.name;
      pet.species = species || pet.species;
      pet.breed = breed || pet.breed;
      pet.age = age || pet.age;
      pet.price = price || pet.price;
      pet.description = description || pet.description;
      pet.imageUrl = imageUrl || pet.imageUrl;
      pet.status = status || pet.status;

      const updatedPet = await pet.save();
      res.json(updatedPet);
    } else {
      res.status(404);
      throw new Error('Pet not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (pet) {
      await pet.remove();
      res.json({ message: 'Pet removed' });
    } else {
      res.status(404);
      throw new Error('Pet not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};
