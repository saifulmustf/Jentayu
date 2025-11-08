/* Path: src/app/api/team-members/route.js */
import dbConnect from '@/lib/dbConnect';
import TeamMember from '@/models/TeamMember';
import { NextResponse } from 'next/server';

// Ambil SEMUA anggota berdasarkan teamId (cth: /api/team-members?teamId=racing-plane)
export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ success: false, error: 'Team ID diperlukan' }, { status: 400 });
    }

    const members = await TeamMember.find({ teamId: teamId }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Buat 1 anggota BARU
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json(); // Akan berisi { teamId, positionTitle, memberName }
    const newMember = await TeamMember.create(body);
    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}