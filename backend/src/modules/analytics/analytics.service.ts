import pool from "../../config/db";

export async function createCardShare(
  userId: number,
  type: "QR" | "shareLink",
) {
  const result = await pool.query(
    `INSERT INTO card_share_metrics (user_id, type)
     VALUES ($1, $2)
     RETURNING id`,
    [userId, type],
  );
  return result.rows[0];
}

export async function addUserView(
  cardShareId: number,
  visitorId: number,
  countryName?: string,
) {
  const result = await pool.query(
    `INSERT INTO user_view_metrics (card_share_id, visitor_id, country_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (card_share_id, visitor_id) DO NOTHING
     RETURNING id`,
    [cardShareId, visitorId, countryName ?? null],
  );
  return result.rows[0] || null; // null means deduped
}

export async function addCardSave(cardShareId: number, visitorId: number) {
  const result = await pool.query(
    `INSERT INTO card_save_metrics (card_share_id, visitor_id)
     VALUES ($1, $2)
     ON CONFLICT (card_share_id, visitor_id) DO NOTHING
     RETURNING id`,
    [cardShareId, visitorId],
  );
  return result.rows[0] || null;
}

export async function addProfileVisit(
  cardShareId: number,
  visitorId: number,
  visitingSource:
    | "linkedin"
    | "website"
    | "instagram"
    | "facebook"
    | "twitter"
    | "direct"
    | "other",
) {
  const result = await pool.query(
    `INSERT INTO profile_visit_metrics (card_share_id, visitor_id, visiting_source)
     VALUES ($1, $2, $3)
     ON CONFLICT (card_share_id, visitor_id) DO NOTHING
     RETURNING id`,
    [cardShareId, visitorId, visitingSource],
  );
  return result.rows[0] || null;
}

export async function getUserCardMetrics(userId: number) {
  try {
    const result = await pool.query(`SELECT * FROM get_user_card_metrics($1)`, [
      userId,
    ]);
    return result.rows[0];
  } catch (err: any) {
    // Fallback aggregation if RPC is not available
    const sharesRes = await pool.query(
      `SELECT COUNT(*)::int AS total_shares
       FROM card_share_metrics
       WHERE user_id = $1`,
      [userId],
    );

    const viewsRes = await pool.query(
      `SELECT COUNT(*)::int AS total_views
       FROM user_view_metrics uvm
       JOIN card_share_metrics csm ON csm.id = uvm.card_share_id
       WHERE csm.user_id = $1`,
      [userId],
    );

    const savesRes = await pool.query(
      `SELECT COUNT(*)::int AS total_saves
       FROM card_save_metrics csm2
       JOIN card_share_metrics csm ON csm.id = csm2.card_share_id
       WHERE csm.user_id = $1`,
      [userId],
    );

    const total_shares = sharesRes.rows[0]?.total_shares ?? 0;
    const total_views = viewsRes.rows[0]?.total_views ?? 0;
    const total_saves = savesRes.rows[0]?.total_saves ?? 0;
    const save_rate_percentage =
      total_views > 0
        ? Math.round((total_saves / total_views) * 100 * 100) / 100
        : 0;

    return {
      user_id: userId,
      total_shares,
      total_views,
      total_saves,
      save_rate_percentage,
    };
  }
}

export async function getUserProfileAnalytics(userId: number) {
  try {
    // Helper function to calculate percentage change
    const calculateChange = (current: number, previous: number): number => {
      if (!previous || previous === 0) {
        return current > 0 ? 100 : 0;
      }
      const change = ((current - previous) / previous) * 100;
      const cappedChange = Math.min(change, 100); // Cap at 100%
      return Math.round(cappedChange * 100) / 100;
    };

    // Helper function to calculate rates
    const calculateRate = (numerator: number, denominator: number): number => {
      if (!denominator || denominator === 0) return 0;
      const rate = (numerator / denominator) * 100;
      return Math.round(rate * 100) / 100;
    };

    // Fetch all metrics grouped by date
    const allViewsResult = await pool.query(
      `SELECT DATE(uvm.created_at) as metric_date, COUNT(*) as count 
       FROM user_view_metrics uvm
       JOIN card_share_metrics csm ON csm.id = uvm.card_share_id
       WHERE csm.user_id = $1
       GROUP BY DATE(uvm.created_at)`,
      [userId],
    );

    const allSharesResult = await pool.query(
      `SELECT DATE(created_at) as metric_date, COUNT(*) as count 
       FROM card_share_metrics
       WHERE user_id = $1
       GROUP BY DATE(created_at)`,
      [userId],
    );

    const allVisitsResult = await pool.query(
      `SELECT DATE(pvm.created_at) as metric_date, COUNT(*) as count 
       FROM profile_visit_metrics pvm
       JOIN card_share_metrics csm ON csm.id = pvm.card_share_id
       WHERE csm.user_id = $1
       GROUP BY DATE(pvm.created_at)`,
      [userId],
    );

    const savesResult = await pool.query(
      `SELECT COUNT(*) as total_saves 
       FROM card_save_metrics csm2
       JOIN card_share_metrics csm ON csm.id = csm2.card_share_id
       WHERE csm.user_id = $1`,
      [userId],
    );

    // Fetch weekly activity data (current week only: Sunday to today)
    const weeklyActivityResult = await pool.query(
      `SELECT 
        DATE(created_at)::text as date,
        EXTRACT(DOW FROM created_at)::text as day,
        COUNT(*) as count
       FROM card_share_metrics
       WHERE user_id = $1 
       AND DATE(created_at) >= CURRENT_DATE - INTERVAL '1 day' * EXTRACT(DOW FROM CURRENT_DATE)::int
       AND DATE(created_at) <= CURRENT_DATE
       GROUP BY DATE(created_at), EXTRACT(DOW FROM created_at)
       ORDER BY DATE(created_at)`,
      [userId],
    );

    // Fetch country/location data
    const countryUsersResult = await pool.query(
      `SELECT 
        uvm.country_name as country,
        COUNT(*) as views
       FROM user_view_metrics uvm
       JOIN card_share_metrics csm ON csm.id = uvm.card_share_id
       WHERE csm.user_id = $1
       GROUP BY uvm.country_name
       ORDER BY COUNT(*) DESC
       LIMIT 10`,
      [userId],
    );

    // Helper to get count for a specific date
    const getCountForDate = (rows: any[], targetDate: Date): number => {
      const dateStr = targetDate.toISOString().split('T')[0];
      const row = rows.find(r => {
        const rowDate = new Date(r.metric_date).toISOString().split('T')[0];
        return rowDate === dateStr;
      });
      return row ? parseInt(row.count) : 0;
    };

    // Helper to get sum for a date range
    const getSumForDateRange = (rows: any[], startDate: Date, endDate: Date): number => {
      return rows.reduce((sum, row) => {
        const rowDate = new Date(row.metric_date);
        if (rowDate >= startDate && rowDate <= endDate) {
          return sum + parseInt(row.count);
        }
        return sum;
      }, 0);
    };

    // Today and Yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayViews = getCountForDate(allViewsResult.rows, today);
    const todayShares = getCountForDate(allSharesResult.rows, today);
    const todayVisits = getCountForDate(allVisitsResult.rows, today);

    const yesterdayViews = getCountForDate(allViewsResult.rows, yesterday);
    const yesterdayShares = getCountForDate(allSharesResult.rows, yesterday);
    const yesterdayVisits = getCountForDate(allVisitsResult.rows, yesterday);

    // This Week and Last Week
    const getWeekRange = (weeksOffset: number = 0) => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay() - (weeksOffset * 7));
      const weekStart = new Date(d);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      return { weekStart, weekEnd };
    };

    const { weekStart: thisWeekStart, weekEnd: thisWeekEnd } = getWeekRange(0);
    const { weekStart: lastWeekStart, weekEnd: lastWeekEnd } = getWeekRange(1);

    const thisWeekViews = getSumForDateRange(allViewsResult.rows, thisWeekStart, thisWeekEnd);
    const thisWeekShares = getSumForDateRange(allSharesResult.rows, thisWeekStart, thisWeekEnd);
    const thisWeekVisits = getSumForDateRange(allVisitsResult.rows, thisWeekStart, thisWeekEnd);

    const lastWeekViews = getSumForDateRange(allViewsResult.rows, lastWeekStart, lastWeekEnd);
    const lastWeekShares = getSumForDateRange(allSharesResult.rows, lastWeekStart, lastWeekEnd);
    const lastWeekVisits = getSumForDateRange(allVisitsResult.rows, lastWeekStart, lastWeekEnd);

    // This Month and Last Month
    const getMonthRange = (monthsOffset: number = 0) => {
      const d = new Date();
      const monthStart = new Date(d.getFullYear(), d.getMonth() - monthsOffset, 1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(d.getFullYear(), d.getMonth() - monthsOffset + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      
      return { monthStart, monthEnd };
    };

    const { monthStart: thisMonthStart, monthEnd: thisMonthEnd } = getMonthRange(0);
    const { monthStart: lastMonthStart, monthEnd: lastMonthEnd } = getMonthRange(1);

    const thisMonthViews = getSumForDateRange(allViewsResult.rows, thisMonthStart, thisMonthEnd);
    const thisMonthShares = getSumForDateRange(allSharesResult.rows, thisMonthStart, thisMonthEnd);
    const thisMonthVisits = getSumForDateRange(allVisitsResult.rows, thisMonthStart, thisMonthEnd);

    const lastMonthViews = getSumForDateRange(allViewsResult.rows, lastMonthStart, lastMonthEnd);
    const lastMonthShares = getSumForDateRange(allSharesResult.rows, lastMonthStart, lastMonthEnd);
    const lastMonthVisits = getSumForDateRange(allVisitsResult.rows, lastMonthStart, lastMonthEnd);

    // Total metrics
    const totalViews = allViewsResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
    const totalShares = allSharesResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
    const totalVisits = allVisitsResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
    const totalSaves = parseInt(savesResult.rows[0]?.total_saves) || 0;

    // Format weekly activity
    const weeklyActivity = weeklyActivityResult.rows.map(row => ({
      date: row.date,
      day: row.day,
      count: parseInt(row.count),
    }));

    // Format country users
    const countryUsers = countryUsersResult.rows.map(row => ({
      country: row.country || "Unknown",
      views: parseInt(row.views),
    }));

    const result = {
      profile_views: totalViews,
      profile_visits: totalVisits,
      rates: {
        view_rate_percentage: calculateRate(totalViews, totalShares),
        share_rate_percentage: calculateRate(totalShares, totalViews),
        visit_rate_percentage: calculateRate(totalVisits, totalViews),
      },
      today: {
        views: todayViews,
        shares: todayShares,
        visits: todayVisits,
        views_change: calculateChange(todayViews, yesterdayViews),
        shares_change: calculateChange(todayShares, yesterdayShares),
        visits_change: calculateChange(todayVisits, yesterdayVisits),
      },
      this_week: {
        views: thisWeekViews,
        shares: thisWeekShares,
        visits: thisWeekVisits,
        views_change: calculateChange(thisWeekViews, lastWeekViews),
        shares_change: calculateChange(thisWeekShares, lastWeekShares),
        visits_change: calculateChange(thisWeekVisits, lastWeekVisits),
      },
      this_month: {
        views: thisMonthViews,
        shares: thisMonthShares,
        visits: thisMonthVisits,
        views_change: calculateChange(thisMonthViews, lastMonthViews),
        shares_change: calculateChange(thisMonthShares, lastMonthShares),
        visits_change: calculateChange(thisMonthVisits, lastMonthVisits),
      },
      today_vs_yesterday: {
        views_diff: todayViews - yesterdayViews,
        shares_diff: todayShares - yesterdayShares,
        visits_diff: todayVisits - yesterdayVisits,
      },
      weekly_activity: weeklyActivity,
      country_users: countryUsers,
    };

    console.log("📊 Analytics Calculation Result:", JSON.stringify(result, null, 2));
    return result;
  } catch (err: any) {
    console.error("Error fetching user profile analytics:", err);
    throw new Error("Failed to fetch analytics");
  }
}
