const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth')

const SauceCtrl = require('../controllers/Sauce');
const multer = require('../Middleware/Multer-config')


router.get('/', auth, SauceCtrl.getAllSauces);
router.post('/', auth, multer, SauceCtrl.createSauce);
router.get('/:id', auth, SauceCtrl.getOneSauce);
router.put('/:id', auth, SauceCtrl.modifySauce);
router.delete('/:id', auth, SauceCtrl.deleteSauce);
router.post('/:id/like', auth, SauceCtrl.likeSauce)

module.exports = router;