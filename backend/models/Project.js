const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    num: { type: String, required: true },
    name: { type: String, required: true },
    tagline: { type: String },
    type: { type: String, enum: ['fullstack', 'backend', 'planned'], required: true },
    status: { type: String, enum: ['live', 'building', 'planned'], required: true },
    stack: [String],
    description: String,
    githubUrl: String,
    liveUrl: String,
    highlights: [String],
    architecture: {
      overview: String,
      intuition: String,
      diagram: String,
      decisions: [
        {
          title: String,
          reasoning: String
        }
      ],
      challenges: [
        {
          problem: String,
          solution: String
        }
      ],
      whatILearned: [String],
      scalingThoughts: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
