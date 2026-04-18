const express = require('express');
const router = express.Router();
const {
  getAllStudents, getStudentById, addStudent, updateStudent, deleteStudent, getStats
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { studentRules, validate } = require('../middleware/validate');
const { upload } = require('../config/cloudinary');

router.get('/stats', getStats);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', protect, upload.single('image'), studentRules, validate, addStudent);
router.put('/:id', protect, upload.single('image'), updateStudent);
router.delete('/:id', protect, deleteStudent);

module.exports = router;
