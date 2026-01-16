const express = require('express');
const { deletee, update, getById, getAll, create } = require('../controllers/User/ThoiGianGio_Controller');
const router = express.Router();

// Tạo mới
router.post('/', create);

// Lấy danh sách
router.get('/', getAll);

// Lấy chi tiết theo ID
router.get('/:id', getById);

// Cập nhật theo ID
router.put('/:id', update);

// Xóa theo ID
router.delete('/:id', deletee);

module.exports = router;