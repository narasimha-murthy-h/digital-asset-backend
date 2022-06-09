const mongoose = require('mongoose');

const assetSchema = mongoose.Schema({
  object_id: String,
  company_id: String,
  asset_id: String,
  owner: String,
  name: String,
  status: String,
  type: String,
  content_reference: String,
  mime_type: String,
  version_number: String,
  language: String,
  note: String,
});

module.exports = mongoose.model('Asset', assetSchema);
