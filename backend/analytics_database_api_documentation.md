# Analytics Metrics Database Documentation

This document describes the **analytics schema, constraints, and RPC logic** used to track card sharing, views, saves, and profile visits.

---

## 1. Overview

The system tracks how digital cards are:
- **Shared** (QR / share link)
- **Viewed**
- **Saved**
- **Profile visited**

All metrics are designed to:
- Support anonymous and identified visitors
- Prevent duplicate analytics
- Be conversion-friendly and analytics-safe

---

## 2. ENUM Types

### `card_share_type`
```sql
QR | shareLink
```
Used to identify how a card was shared.

### `visiting_source_type`
```sql
linkedin | website | instagram | facebook | twitter | direct | other
```
Used to track profile visit source.

---

## 3. Tables

### 3.1 `card_share_metrics`
Tracks every time a card is shared.

| Column | Type | Description |
|------|-----|-------------|
| id | BIGSERIAL | Primary key |
| user_id | BIGINT | Card owner |
| type | ENUM | QR or shareLink |
| visitor_id | BIGINT | Visitor identifier (nullable) |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Auto-updated timestamp |

Notes:
- `visitor_id` may be NULL for unknown visitors
- `updated_at` is handled via trigger

---

### 3.2 `user_view_metrics`
Tracks **unique views per visitor per card**.

| Column | Type | Description |
|------|-----|-------------|
| id | BIGSERIAL | Primary key |
| card_share_id | BIGINT | FK → card_share_metrics |
| visitor_id | BIGINT | Visitor identifier |
| country_name | VARCHAR | Visitor country |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Auto-updated timestamp |

Constraints:
- Unique per `(card_share_id, visitor_id)`
- Anonymous views allowed but deduplicated

---

### 3.3 `card_save_metrics`
Tracks when a visitor saves a card.

| Column | Type | Description |
|------|-----|-------------|
| id | BIGSERIAL | Primary key |
| card_share_id | BIGINT | FK → card_share_metrics |
| visitor_id | BIGINT | Visitor identifier |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Auto-updated timestamp |

Constraints:
- Unique save per `(card_share_id, visitor_id)`
- Prevents duplicate saves

---

### 3.4 `profile_visit_metrics`
Tracks profile visits and source.

| Column | Type | Description |
|------|-----|-------------|
| id | BIGSERIAL | Primary key |
| card_share_id | BIGINT | FK → card_share_metrics |
| visitor_id | BIGINT | Visitor identifier |
| visiting_source | ENUM | Visit source |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Auto-updated timestamp |

Constraints:
- One visit per `(card_share_id, visitor_id)`

---

## 4. Triggers

### Auto-update `updated_at`
All tables use the shared trigger:
```sql
update_updated_at_column()
```

This ensures `updated_at` is refreshed on every update.

---

## 5. Indexing Strategy

Indexes are added to:
- Improve join performance
- Optimize analytics queries

Key indexes:
- `card_share_metrics(user_id)`
- `user_view_metrics(card_share_id)`
- `card_save_metrics(card_share_id)`
- `profile_visit_metrics(card_share_id)`

---

## 6. Analytics RPC

### Function: `get_user_card_metrics(user_id)`

Returns aggregated metrics for a single card owner.

#### Metrics Returned
- Total shares
- Total views
- Total saves
- Save rate percentage

#### Definition
```sql
save_rate = (total_saves / total_views) * 100
```

Division is safe-guarded against zero views.

#### Example Call
```sql
SELECT get_user_card_metrics(2);
```

#### Example Response
```json
{
  "user_id": 2,
  "total_views": 3,
  "total_shares": 2,
  "total_saves": 2,
  "save_rate_percentage": 66.67
}
```

---

## 7. Data Integrity Rules

- No duplicate views per visitor
- No duplicate saves per visitor
- No cascade deletes (analytics safety)
- Visitor identity drives uniqueness

---

## 8. Analytics Philosophy

- **Views ≠ Visitors**
- **Save rate is behavioral, not absolute conversion**
- Focus on trends, not raw totals
- Clean separation of events

---

## 9. Ready for Extension

This schema supports:
- Daily / monthly aggregation
- Funnel analysis
- Geo analytics
- Source-based conversion
- Materialized dashboards

---

## 10. Summary

You now have:
- A scalable analytics schema
- Clean deduplication rules
- Safe RPC aggregation
- Production-ready tracking

This design aligns with industry-grade analytics systems (GA / Mixpanel style).
