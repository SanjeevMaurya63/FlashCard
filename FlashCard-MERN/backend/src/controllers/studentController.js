const Student = require('../models/Student');
const { cloudinary } = require('../config/cloudinary');

// GET /api/students — search + filter + pagination
const getAllStudents = async (req, res, next) => {
  try {
    const { search, course, city, year, page = 1, limit = 9, sort = '-createdAt' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }
    if (course) query.course = { $regex: course, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (year) query.year = Number(year);

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [students, total] = await Promise.all([
      Student.find(query)
        .populate('addedBy', 'username')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Student.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/:id
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('addedBy', 'username');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

// POST /api/students
const addStudent = async (req, res, next) => {
  try {
    const { name, course, city, email, phone, year } = req.body;

    const imageData = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: '', publicId: '' };

    const student = await Student.create({
      name, course, city,
      email: email || '',
      phone: phone || '',
      year: year || 1,
      image: imageData,
      addedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Student added successfully', data: student });
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Only the user who added or admin can update
    if (student.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this student' });
    }

    const { name, course, city, email, phone, year } = req.body;
    if (name) student.name = name;
    if (course) student.course = course;
    if (city) student.city = city;
    if (email !== undefined) student.email = email;
    if (phone !== undefined) student.phone = phone;
    if (year) student.year = year;

    // If new image uploaded, delete old from cloudinary
    if (req.file) {
      if (student.image.publicId) {
        await cloudinary.uploader.destroy(student.image.publicId);
      }
      student.image = { url: req.file.path, publicId: req.file.filename };
    }

    await student.save();
    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    if (student.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this student' });
    }

    // Delete image from cloudinary
    if (student.image.publicId) {
      await cloudinary.uploader.destroy(student.image.publicId);
    }

    await student.deleteOne();
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/stats
const getStats = async (req, res, next) => {
  try {
    const [total, courses, cities] = await Promise.all([
      Student.countDocuments(),
      Student.distinct('course'),
      Student.distinct('city'),
    ]);

    res.json({
      success: true,
      data: { total, uniqueCourses: courses.length, uniqueCities: cities.length },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStudents, getStudentById, addStudent, updateStudent, deleteStudent, getStats };
