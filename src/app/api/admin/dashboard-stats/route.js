/* Path: src/app/api/admin/dashboard-stats/route.js */
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

// Import SEMUA model yang ada di folder models Anda
import GalleryItem from '@/models/GalleryItem';
import NewsItem from '@/models/NewsItem';
import AchievementItem from '@/models/AchievementItem';
import SponsorItem from '@/models/SponsorItem';
import SubTeam from '@/models/SubTeam';
import BoardMember from '@/models/BoardMember';

export async function GET() {
  try {
    await dbConnect();

    // Hitung jumlah dokumen untuk SEMUA model secara paralel
    const [
      galleryCount,
      newsCount,
      achievementCount,
      sponsorCount,
      subTeamCount,
      boardCount
    ] = await Promise.all([
      GalleryItem.countDocuments(),
      NewsItem.countDocuments(),
      AchievementItem.countDocuments(),
      SponsorItem.countDocuments(),
      SubTeam.countDocuments(),
      BoardMember.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        gallery: galleryCount || 0,
        news: newsCount || 0,
        achievement: achievementCount || 0,
        sponsor: sponsorCount || 0,
        subTeam: subTeamCount || 0,
        board: boardCount || 0,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching stats:", error);
    // Kembalikan 0 jika terjadi error agar dashboard tidak crash total
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      data: { gallery: 0, news: 0, achievement: 0, sponsor: 0, subTeam: 0, board: 0 }
    }, { status: 500 });
  }
}