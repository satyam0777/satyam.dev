const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    tag: String,
    excerpt: String,
    content: { type: String, required: true },
    publishedAt: String,
    readTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', BlogSchema);
