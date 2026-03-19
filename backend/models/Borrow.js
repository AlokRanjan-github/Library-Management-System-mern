import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['borrowed', 'pending_return', 'returned'],
      default: 'borrowed',
    },
  },
  {
    timestamps: true, // Also provides createdAt and updatedAt for borrow records
  }
);

const Borrow = mongoose.model('Borrow', borrowSchema);

export default Borrow;
