const mongoose = require('mongoose');
const { Collection } = require('../config/storeEngine');
const { getStatus } = require('../config/db');

function createModel(name, schemaDefinition, collectionName) {
  let mongooseModel = null;
  try {
    const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });
    mongooseModel = mongoose.models[name] || mongoose.model(name, schema);
  } catch (e) {
    // Schema creation fallback
  }

  const fileStore = new Collection(collectionName || name.toLowerCase() + 's');

  return {
    async find(query = {}) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.find(query).sort({ createdAt: -1 });
      }
      return fileStore.find(query);
    },

    async findOne(query = {}) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.findOne(query);
      }
      return fileStore.findOne(query);
    },

    async findById(id) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.findById(id);
      }
      return fileStore.findById(id);
    },

    async create(doc) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.create(doc);
      }
      return fileStore.create(doc);
    },

    async insertMany(docs) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.insertMany(docs);
      }
      return fileStore.insertMany(docs);
    },

    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.findByIdAndUpdate(id, update, options);
      }
      return fileStore.findByIdAndUpdate(id, update, options);
    },

    async findByIdAndDelete(id) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.findByIdAndDelete(id);
      }
      return fileStore.findByIdAndDelete(id);
    },

    async deleteMany(query = {}) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.deleteMany(query);
      }
      return fileStore.deleteMany(query);
    },

    async countDocuments(query = {}) {
      if (getStatus().connected && mongooseModel) {
        return mongooseModel.countDocuments(query);
      }
      return fileStore.countDocuments(query);
    }
  };
}

module.exports = { createModel };
