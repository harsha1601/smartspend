const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '..', '.data');
const dataFile = path.join(dataDir, 'smartspend.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const defaultData = {
  users: [],
  incomes: [],
  expenses: [],
  budgets: [],
  savings: [],
  shopping: []
};

let memoryStore = null;

function loadStore() {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      memoryStore = JSON.parse(content);
    } else {
      memoryStore = JSON.parse(JSON.stringify(defaultData));
      saveStore();
    }
  } catch (e) {
    memoryStore = JSON.parse(JSON.stringify(defaultData));
  }
  return memoryStore;
}

function saveStore() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving datastore:', err.message);
  }
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

class Collection {
  constructor(collectionName) {
    this.name = collectionName;
  }

  _getItems() {
    const store = loadStore();
    if (!store[this.name]) {
      store[this.name] = [];
    }
    return store[this.name];
  }

  async find(query = {}) {
    const items = this._getItems();
    const filtered = items.filter(item => {
      for (const [key, val] of Object.entries(query)) {
        if (key === '$or' && Array.isArray(val)) {
          const matchOr = val.some(cond => {
            return Object.entries(cond).every(([k, v]) => {
              if (v instanceof RegExp) return v.test(String(item[k] || ''));
              return String(item[k]) === String(v);
            });
          });
          if (!matchOr) return false;
          continue;
        }
        if (val instanceof RegExp) {
          if (!val.test(String(item[key] || ''))) return false;
        } else if (typeof val === 'object' && val !== null) {
          if (val.$gte !== undefined && item[key] < val.$gte) return false;
          if (val.$lte !== undefined && item[key] > val.$lte) return false;
          if (val.$in && !val.$in.includes(item[key])) return false;
        } else if (String(item[key]) !== String(val)) {
          return false;
        }
      }
      return true;
    });

    // Return a clone array sorted by createdAt descending
    const result = filtered.map(x => ({ ...x }));
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return result;
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items.length > 0 ? { ...items[0] } : null;
  }

  async findById(id) {
    const items = this._getItems();
    const item = items.find(i => String(i._id) === String(id));
    return item ? { ...item } : null;
  }

  async create(doc) {
    const items = this._getItems();
    const now = new Date();
    const newDoc = {
      _id: generateId(),
      ...doc,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    items.push(newDoc);
    saveStore();
    return { ...newDoc };
  }

  async insertMany(docs) {
    const items = this._getItems();
    const now = new Date();
    const created = docs.map(doc => ({
      _id: generateId(),
      ...doc,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }));
    items.push(...created);
    saveStore();
    return created;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const items = this._getItems();
    const idx = items.findIndex(i => String(i._id) === String(id));
    if (idx === -1) return null;

    const payload = update.$set ? { ...update.$set } : { ...update };
    delete payload._id;

    items[idx] = {
      ...items[idx],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    saveStore();
    return { ...items[idx] };
  }

  async findByIdAndDelete(id) {
    const items = this._getItems();
    const idx = items.findIndex(i => String(i._id) === String(id));
    if (idx === -1) return null;
    const [deleted] = items.splice(idx, 1);
    saveStore();
    return deleted;
  }

  async deleteMany(query = {}) {
    const store = loadStore();
    if (Object.keys(query).length === 0) {
      const count = (store[this.name] || []).length;
      store[this.name] = [];
      saveStore();
      return { deletedCount: count };
    }
    const beforeCount = (store[this.name] || []).length;
    store[this.name] = (store[this.name] || []).filter(item => {
      for (const [k, v] of Object.entries(query)) {
        if (String(item[k]) === String(v)) return false;
      }
      return true;
    });
    saveStore();
    return { deletedCount: beforeCount - store[this.name].length };
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }
}

module.exports = {
  Collection,
  generateId
};
