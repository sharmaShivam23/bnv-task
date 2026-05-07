const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { exportUsersToCSV } = require('../utils/csvExporter');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// ─── GET ALL USERS (with pagination + search) ────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const search = req.query.search ? req.query.search.trim() : '';

    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(res, 200, 'Users fetched successfully', users, {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE USER ─────────────────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    return sendSuccess(res, 200, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

// ─── CREATE USER ─────────────────────────────────────────────────────────────
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, mobile, gender, status, location } = req.body;

    const userData = {
      firstName,
      lastName,
      email,
      mobile,
      gender,
      status,
      location,
    };

    if (req.file) {
      userData.profileImage = req.file.path;
    }

    const user = await User.create(userData);
    return sendSuccess(res, 201, 'User created successfully', user);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE USER ─────────────────────────────────────────────────────────────
const updateUser = async (req, res, next) => {
  try {
    const existing = await User.findById(req.params.id);
    if (!existing) {
      return sendError(res, 404, 'User not found');
    }

    const { firstName, lastName, email, mobile, gender, status, location } = req.body;

    const updateData = { firstName, lastName, email, mobile, gender, status, location };

    // If a new image was uploaded
    if (req.file) {
      if (existing.profileImage) {
        try {
          // Attempt to extract public_id from Cloudinary URL and delete
          const urlParts = existing.profileImage.split('/');
          const filename = urlParts[urlParts.length - 1];
          const publicId = 'bnv_users/' + filename.split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed to delete old image from Cloudinary:", err);
        }
      }
      updateData.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    return sendSuccess(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE USER ─────────────────────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Remove profile image from Cloudinary if exists
    if (user.profileImage) {
      try {
        const urlParts = user.profileImage.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = 'bnv_users/' + filename.split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }

    await User.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ─── SEARCH USERS ─────────────────────────────────────────────────────────────
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return sendError(res, 400, 'Search query "q" is required');
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: q.trim(), $options: 'i' } },
        { lastName: { $regex: q.trim(), $options: 'i' } },
        { email: { $regex: q.trim(), $options: 'i' } },
        { mobile: { $regex: q.trim(), $options: 'i' } },
        { location: { $regex: q.trim(), $options: 'i' } },
      ],
    })
      .limit(20)
      .lean();

    return sendSuccess(res, 200, `Found ${users.length} result(s)`, users);
  } catch (error) {
    next(error);
  }
};

// ─── EXPORT TO CSV ────────────────────────────────────────────────────────────
const exportToCSV = async (req, res, next) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).lean();

    if (users.length === 0) {
      return sendError(res, 404, 'No users found to export');
    }

    const csv = exportUsersToCSV(users);
    const filename = `users-export-${Date.now()}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE USER STATUS (inline toggle) ──────────────────────────────────────
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status)) {
      return sendError(res, 400, 'Status must be Active or Inactive');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'Status updated successfully', user);
  } catch (error) {
    next(error);
  }
};

// ─── GET USER STATS ────────────────────────────────────────────────────────────
const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const inactiveUsers = await User.countDocuments({ status: 'Inactive' });
    const maleUsers = await User.countDocuments({ gender: 'Male' });
    const femaleUsers = await User.countDocuments({ gender: 'Female' });

    return sendSuccess(res, 200, 'User stats fetched successfully', {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      male: maleUsers,
      female: femaleUsers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  exportToCSV,
  updateUserStatus,
  getUserStats,
};
