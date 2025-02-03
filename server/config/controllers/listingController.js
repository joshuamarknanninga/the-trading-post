import Listing from '../models/Listing.js';

export const getListings = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = category ? { category } : {};
    
    const listings = await Listing.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');
      
    const count = await Listing.countDocuments(query);

    res.json({
      listings,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createListing = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    
    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      user: req.user._id
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};