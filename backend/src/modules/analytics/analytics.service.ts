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
    const result = await pool.query(
      `SELECT get_user_profile_analytics($1) AS analytics`,
      [userId],
    );
    return result.rows[0]?.analytics || null;
  } catch (err: any) {
    console.error("Error fetching user profile analytics:", err);
    throw new Error("Failed to fetch analytics");
  }
}
