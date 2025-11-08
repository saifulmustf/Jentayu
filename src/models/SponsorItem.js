/* Path: src/models/SponsorItem.js */

import mongoose from 'mongoose';

/* Cetakan untuk data Sponsor.
 * Kita hanya butuh nama sponsor dan URL logonya.
*/
const SponsorItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama sponsor tidak boleh kosong.'],
    unique: true, // Nama sponsor idealnya unik
  },
  logoUrl: {
    type: String,
    required: [true, 'URL Logo tidak boleh kosong.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* Mencegah Mongoose membuat model baru setiap kali hot-reload */
export default mongoose.models.SponsorItem || mongoose.model('SponsorItem', SponsorItemSchema);