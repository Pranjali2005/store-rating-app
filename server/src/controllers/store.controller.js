const mongoose = require('mongoose');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const asyncHandler = require('../utils/asyncHandler');
const { isValidRating } = require('../utils/validators');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Returns stores with avgRating, ratingCount and the current user's rating
async function findStores({ search, storeId, userId }) {
  const match = {};
  if (search) match.name = { $regex: escapeRegex(search), $options: 'i' };
  if (storeId) match._id = new mongoose.Types.ObjectId(storeId);
  const uid = new mongoose.Types.ObjectId(userId);

  return Store.aggregate([
    { $match: match },
    { $lookup: { from: 'ratings', localField: '_id', foreignField: 'store', as: 'ratings' } },
    {
      $addFields: {
        ratingCount: { $size: '$ratings' },
        avgRating: { $round: [{ $ifNull: [{ $avg: '$ratings.value' }, 0] }, 1] },
        myRating: {
          $arrayElemAt: [
            {
              $map: {
                input: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r.user', uid] } } },
                as: 'm',
                in: '$$m.value',
              },
            },
            0,
          ],
        },
      },
    },
    { $project: { ratings: 0, owner: 0, __v: 0 } },
    { $sort: { name: 1 } },
  ]);
}

exports.listStores = asyncHandler(async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  const stores = await findStores({ search, userId: req.user._id });
  res.json(stores);
});

exports.rateStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { value } = req.body;

  if (!mongoose.isValidObjectId(storeId)) return res.status(400).json({ message: 'Invalid store id' });
  if (!isValidRating(value)) return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' });
  if (!(await Store.exists({ _id: storeId }))) return res.status(404).json({ message: 'Store not found' });

  // Keyed by the logged-in user, so nobody can touch another user's rating
  await Rating.findOneAndUpdate(
    { user: req.user._id, store: storeId },
    { value },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const [store] = await findStores({ storeId, userId: req.user._id });
  res.json(store);
});