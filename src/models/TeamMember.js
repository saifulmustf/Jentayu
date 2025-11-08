/* Path: src/models/TeamMember.js */
import mongoose from 'mongoose';

/*
  Ini adalah 'cetakan' untuk setiap anggota tim.
  - teamId: Link ke tim mana dia berafiliasi (cth: 'racing-plane')
  - positionTitle: Jabatannya (cth: 'Ketua Tim')
  - memberName: Namanya (cth: 'Ahmad Fulan')
*/
const TeamMemberSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: [true, 'Team ID tidak boleh kosong.'],
    ref: 'SubTeam', // Referensi (opsional) ke SubTeam
  },
  positionTitle: {
    type: String,
    required: [true, 'Jabatan tidak boleh kosong.'],
  },
  memberName: {
    type: String,
    required: [true, 'Nama tidak boleh kosong.'],
  },
}, { timestamps: true });

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);