const Store = require('../models/Store');
const Rating = require('../models/Rating');
const asyncHandler = require('../utils/asyncHandler');

const IMAGE_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const MAX_IMAGE_CHARS = 900000;

exports.dashboard = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) return res.status(404).json({ message: 'No store is linked to this account' });

  const ratings = await Rating.find({ store: store._id })
    .populate('user', 'name email')
    .sort({ updatedAt: -1 });

  const total = ratings.reduce((sum, r) => sum + r.value, 0);

  res.json({
    store: { id: store._id, name: store.name, address: store.address, image: store.image },
    averageRating: ratings.length ? Number((total / ratings.length).toFixed(1)) : 0,
    totalRatings: ratings.length,
    ratings: ratings.map((r) => ({
      id: r._id,
      value: r.value,
      updatedAt: r.updatedAt,
      user: { name: r.user?.name, email: r.user?.email },
    })),
  });
});

exports.updateImage = asyncHandler(async (req, res) => {
  const { image } = req.body;
  const valid =
    image === '' || (typeof image === 'string' && image.length <= MAX_IMAGE_CHARS && IMAGE_RE.test(image));
  if (!valid) {
    return res.status(400).json({ message: 'Please upload a valid JPEG, PNG or WebP image under 500 KB' });
  }

  // Scoped to the logged-in owner's own store
  const store = await Store.findOneAndUpdate({ owner: req.user._id }, { image }, { new: true });
  if (!store) return res.status(404).json({ message: 'No store is linked to this account' });

  res.json({ image: store.image });
});