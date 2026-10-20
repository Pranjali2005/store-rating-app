const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const auth = require('../controllers/auth.controller');
const stores = require('../controllers/store.controller');
const owner = require('../controllers/owner.controller');

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', protect, auth.me);

router.get('/stores', protect, authorize('USER'), stores.listStores);
router.put('/stores/:storeId/rating', protect, authorize('USER'), stores.rateStore);

router.get('/owner/dashboard', protect, authorize('STORE_OWNER'), owner.dashboard);
router.put('/owner/store/image', protect, authorize('STORE_OWNER'), owner.updateImage);

module.exports = router;