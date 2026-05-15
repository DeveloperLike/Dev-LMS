export const getCombinedSourceLeadQuery = ({
  whereClause,
  whereClauseWithoutDate,
  pageSize,
  offset,
  startUTC,
  endUTC,
}) => `

SELECT * FROM (

WITH base AS (
    SELECT 
        lml.id,
        lml.lead_source_id,
        COALESCE(lmls.source_group,'Others') AS source_group,
        lml.interest_count,
        lml.visit_count,
        lml.vc_count,
        lml.created_at,
        MAX(app.lead_id) AS lead_id,
        MAX(app.registered_date) AS registered_date,
        dup.enquiry_count
    FROM lead_management_lead lml
    LEFT JOIN lead_management_leadsource lmls
        ON lml.lead_source_id = lmls.id
    LEFT JOIN accounting_packagepurchased app
        ON app.lead_id = lml.id
    LEFT JOIN (
        SELECT
            COALESCE(email, phone) contact_key,
            COUNT(*) enquiry_count
        FROM (
            SELECT 
                lead_id,
                MAX(CASE WHEN code='email' THEN value END) email,
                MAX(CASE WHEN code='phone' THEN value END) phone
            FROM lead_management_leadformvalue
            GROUP BY lead_id
        ) contacts
        GROUP BY contact_key
    ) dup
    ON dup.contact_key = (
        SELECT COALESCE(
            MAX(CASE WHEN code='email' THEN value END),
            MAX(CASE WHEN code='phone' THEN value END)
        )
        FROM lead_management_leadformvalue
        WHERE lead_id = lml.id
    )
    ${whereClause}

    GROUP BY
        lml.id,
        lml.lead_source_id,
        lmls.source_group,
        lml.interest_count,
        lml.visit_count,
        lml.vc_count,
        lml.created_at,
        dup.enquiry_count
),

agg AS (
    SELECT 
        lead_source_id,
        source_group,
        COUNT(*) OVER() AS total_count,
        COUNT(DISTINCT id) AS totalleads,
        COUNT(DISTINCT CASE WHEN enquiry_count > 1 THEN id END) AS re_enquired_after,
        COUNT(DISTINCT CASE WHEN interest_count > 0 THEN id END) AS mql,
        COUNT(DISTINCT CASE WHEN (visit_count > 0 OR vc_count > 0) THEN id END) AS sql,
        COUNT(DISTINCT CASE WHEN lead_id IS NOT NULL THEN id END) AS registered,
        0 AS reg_from_date,
        COUNT(DISTINCT CASE WHEN lead_id IS NOT NULL AND DATE(registered_date) - DATE(created_at) <= 7 THEN id END) AS week_0_1,
        COUNT(DISTINCT CASE WHEN lead_id IS NOT NULL AND DATE(registered_date) - DATE(created_at) BETWEEN 8 AND 14 THEN id END) AS week_1_2,
        COUNT(DISTINCT CASE WHEN lead_id IS NOT NULL AND DATE(registered_date) - DATE(created_at) BETWEEN 15 AND 28 THEN id END) AS week_2_4,
        COUNT(DISTINCT CASE WHEN lead_id IS NOT NULL AND DATE(registered_date) - DATE(created_at) > 28 THEN id END) AS week_4_plus
    FROM base agg_source
    GROUP BY lead_source_id, source_group
),

paginated_rows AS (
    SELECT *
    FROM agg
    ORDER BY totalleads DESC
    LIMIT ${pageSize} OFFSET ${offset}
),

subtotal AS (
    SELECT 
        'subtotal' AS row_type,
        NULL AS lead_source_id,
        source_group,
        MAX(total_count) AS total_count,
        SUM(totalleads) AS totalleads,
        SUM(re_enquired_after) AS re_enquired_after,
        SUM(mql) AS mql,
        SUM(sql) AS sql,
        SUM(registered) AS registered,

        0 AS reg_from_date,

        SUM(week_0_1) AS week_0_1,
        SUM(week_1_2) AS week_1_2,
        SUM(week_2_4) AS week_2_4,
        SUM(week_4_plus) AS week_4_plus
    FROM paginated_rows
    GROUP BY source_group
),

grand_full AS (
    SELECT 
        'grand' AS row_type,
        NULL AS lead_source_id,
        'Grand Total' AS source_group,
        (SELECT COUNT(*) FROM agg) AS total_count,
        SUM(totalleads) AS totalleads,
        SUM(re_enquired_after) AS re_enquired_after,
        SUM(mql) AS mql,
        SUM(sql) AS sql,
        SUM(registered) AS registered,

        0 AS reg_from_date,

        SUM(week_0_1) AS week_0_1,
        SUM(week_1_2) AS week_1_2,
        SUM(week_2_4) AS week_2_4,
        SUM(week_4_plus) AS week_4_plus

    FROM agg
),

final AS (
    SELECT 'row' AS row_type, * FROM paginated_rows
    UNION ALL
    SELECT * FROM subtotal
    UNION ALL
    SELECT * FROM grand_full
)

SELECT * FROM final

) t

ORDER BY 
    CASE row_type 
        WHEN 'row' THEN 1
        WHEN 'subtotal' THEN 2
        WHEN 'grand' THEN 3
    END,
    totalleads DESC
`;

export const getRegDateCountsQuery = ({
  whereClauseWithoutDate,
  regStartDate,
  regEndDate,
}) => `

SELECT * FROM (

    WITH filtered_leads AS (

        SELECT
            app.lead_id,
            lml.lead_source_id,
            COALESCE(lmls.source_group, 'Others') AS source_group

        FROM accounting_packagepurchased app

        INNER JOIN lead_management_lead lml
            ON lml.id = app.lead_id

        LEFT JOIN lead_management_leadsource lmls
            ON lml.lead_source_id = lmls.id

        ${whereClauseWithoutDate}

        ${whereClauseWithoutDate ? "AND" : "WHERE"}

        app.registered_date >= '${regStartDate}'
        AND app.registered_date < (
            DATE '${regEndDate}' + INTERVAL '1 day'
        )

        AND lml.assign_to_id IS NOT NULL
        AND TRIM(lml.assign_to_id) <> ''

    ),

    unique_leads AS (

        SELECT
            lead_id,
            MAX(lead_source_id) AS lead_source_id,
            MAX(source_group) AS source_group

        FROM filtered_leads
        GROUP BY lead_id
    )

    SELECT
        lead_source_id,
        source_group,
        'row' AS row_type,
        COUNT(*) AS reg_from_date
    FROM unique_leads
    GROUP BY lead_source_id, source_group

    UNION ALL

    SELECT
        NULL,
        source_group,
        'subtotal',
        COUNT(*)
    FROM unique_leads
    GROUP BY source_group

    UNION ALL

    SELECT
        NULL,
        'Grand Total',
        'grand',
        COUNT(*)
    FROM unique_leads

) t
`;
export const getMarketingLeadQuery = ({ whereClause, sourceGroups }) => `
SELECT
    COALESCE(bmb.name,'Others') AS branch_name,

    COUNT(*) AS total_lead,

    COUNT(*) FILTER (
        WHERE bl.lead_status_id = '4b3428a2-18f5-47ec-a842-ae732ac7c9cb'
    ) AS total_dnp,
    
    COUNT(*) FILTER (
        WHERE bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
    ) AS total_junk,
    
    COUNT(*) FILTER (
        WHERE bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
        AND COALESCE(bl.interest_count, 0) = 0
    ) AS total_marketing_junk,
    
    COUNT(*) FILTER (
        WHERE app.lead_id IS NOT NULL
    ) AS total_registered,

    ROUND(
        (COUNT(*) FILTER (WHERE app.lead_id IS NOT NULL) * 100.0)
        / NULLIF(COUNT(*), 0),
        2
    ) AS total_registered_pct,

    ${sourceGroups
      .map((s) => {
        const key = s.source_group
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");

        return `
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${s.source_group}'
            ) AS "${key}_total",

            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${s.source_group}'
                AND bl.lead_status_id = '4b3428a2-18f5-47ec-a842-ae732ac7c9cb'
            ) AS "${key}_dnp",

            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${s.source_group}'
                AND bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
            ) AS "${key}_junk",

            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${s.source_group}'
                AND bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
                AND COALESCE(bl.interest_count, 0) = 0
            ) AS "${key}_marketing_junk",

            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${s.source_group}'
                AND app.lead_id IS NOT NULL
            ) AS "${key}_registered",

            ROUND(
                (
                    COUNT(*) FILTER (
                        WHERE COALESCE(lmls.source_group,'Others')='${s.source_group}'
                        AND app.lead_id IS NOT NULL
                    ) * 100.0
                )
                /
                NULLIF(
                    COUNT(*) FILTER (
                        WHERE COALESCE(lmls.source_group,'Others')='${s.source_group}'
                    ), 0
                ),
                2
            ) AS "${key}_registered_pct"
        `;
      })
      .join(",")}

FROM (
   SELECT DISTINCT
       lml.id,
       lml.assign_to_id,
       lml.lead_source_id,
       lml.interest_count,
       lml.vc_count,
       lml.visit_count,
       lml.lead_status_id
   FROM lead_management_lead lml
   ${whereClause}
) bl

LEFT JOIN (
    SELECT DISTINCT ON (user_id)
        user_id,
        branch_id
    FROM user_management_user_branch
) umb ON umb.user_id = bl.assign_to_id

LEFT JOIN branch_management_branch bmb
ON umb.branch_id = bmb.id

LEFT JOIN lead_management_leadsource lmls
ON bl.lead_source_id = lmls.id

LEFT JOIN (
    SELECT DISTINCT lead_id
    FROM accounting_packagepurchased
) app 
ON app.lead_id = bl.id

GROUP BY COALESCE(bmb.name,'Others')

ORDER BY
(COALESCE(bmb.name,'Others')='Others'),
COALESCE(bmb.name,'Others')
`;

export const getMarketingRegisteredAtQuery = ({
  whereClauseWithoutDate,
  sourceGroups,
  regStartDate,
  regEndDate,
}) => `

SELECT
    COALESCE(bmb.name,'Others') AS branch_name,

    COUNT(DISTINCT app.lead_id) AS total_registered_at,

    ${sourceGroups
      .map((s) => {
        const key = s.source_group
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");

        return `
                COUNT(DISTINCT CASE
                    WHEN COALESCE(lmls.source_group,'Others')='${s.source_group}'
                    THEN app.lead_id
                END) AS "${key}_registered_at"
            `;
      })
      .join(",")}

FROM accounting_packagepurchased app

INNER JOIN lead_management_lead lml
ON lml.id = app.lead_id

LEFT JOIN (
    SELECT DISTINCT ON (user_id)
        user_id,
        branch_id
    FROM user_management_user_branch
) umb
ON umb.user_id = lml.assign_to_id

LEFT JOIN branch_management_branch bmb
ON umb.branch_id = bmb.id

LEFT JOIN lead_management_leadsource lmls
ON lml.lead_source_id = lmls.id

${whereClauseWithoutDate}

${whereClauseWithoutDate ? "AND" : "WHERE"}

app.registered_date >= '${regStartDate}'
AND app.registered_date < (
    DATE '${regEndDate}' + INTERVAL '1 day'
)

AND lml.assign_to_id IS NOT NULL
AND TRIM(lml.assign_to_id) <> ''

GROUP BY COALESCE(bmb.name,'Others')

ORDER BY
(COALESCE(bmb.name,'Others')='Others'),
COALESCE(bmb.name,'Others')
`;

export const getFacebookCampaignQuery = ({
  whereClause,
  statuses,
  groupBy = "campaign",
}) => `

SELECT
    COALESCE(bl.${groupBy}, 'Others') AS name,

    COUNT(DISTINCT bl.id) AS total_lead,

    COUNT(DISTINCT CASE 
        WHEN bl.interest_count > 0 
        THEN bl.id 
    END) AS mql,

    COUNT(DISTINCT CASE 
        WHEN (bl.visit_count > 0 OR bl.vc_count > 0) 
        THEN bl.id 
    END) AS sql,

    ${statuses
      .map((s) => {
        const safeName = s.name.replace(/'/g, "''");
        const key = s.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
        return `COUNT(DISTINCT CASE WHEN lms.name='${safeName}' THEN bl.id END) AS "${key}"`;
      })
      .join(",")}

FROM (

    SELECT DISTINCT ON (lml.id)
        lml.id,

        COALESCE(NULLIF(TRIM(lml.${groupBy}), ''), 'Others') AS ${groupBy},

        lml.lead_status_id,
        lml.lead_source_id,

        lml.interest_count,
        lml.visit_count,
        lml.vc_count

    FROM lead_management_lead lml

    ${whereClause ? whereClause + " AND" : "WHERE"}

    lml.lead_source_id IN (
        SELECT id 
        FROM lead_management_leadsource
        WHERE LOWER(name) = 'facebook'
    )

    ORDER BY lml.id

) bl

LEFT JOIN lead_management_leadstatus lms
ON bl.lead_status_id = lms.id

GROUP BY bl.${groupBy}

ORDER BY total_lead DESC;

`;

export const getTrackingUrlStatusQuery = ({ whereClause, statuses, type }) => {
  const isReferral = type === "referral_url";

  const joinClause = isReferral
    ? `
        LEFT JOIN lead_management_leadformvalue lfv
        ON lfv.lead_id = lml.id 
        AND lfv.code = 'yg_referral_url'
      `
    : `
        LEFT JOIN lead_management_trackingurl turl
        ON lml.tracking_url_id = turl.id
      `;

  const selectField = isReferral
    ? `COALESCE(NULLIF(lfv.value, ''), 'Others') AS referral_url`
    : `COALESCE(NULLIF(turl.name, ''), 'Others') AS tracking_url`;

  const groupField = isReferral ? "lfv.value" : "turl.name";

  const filterCondition = isReferral
    ? `LOWER(lfv.value) LIKE '%yesgermany%'`
    : `LOWER(turl.name) LIKE '%yesgermany%'`;

  return `
    SELECT
        ${selectField},

        COUNT(*) AS total_lead,

        COUNT(*) FILTER (
            WHERE COALESCE(lml.interest_count, 0) > 0
        ) AS mql,

        COUNT(*) FILTER (
            WHERE COALESCE(lml.visit_count, 0) > 0 
               OR COALESCE(lml.vc_count, 0) > 0
        ) AS sql,

        ${statuses
          .map((s) => {
            const safeName = s.name.replace(/'/g, "''");
            const key = s.name
              .replace(/\s+/g, "_")
              .replace(/[^a-zA-Z0-9_]/g, "");
            return `COUNT(*) FILTER (WHERE lms.name='${safeName}') AS "${key}"`;
          })
          .join(",")}

    FROM lead_management_lead lml

    LEFT JOIN lead_management_leadstatus lms
    ON lml.lead_status_id = lms.id

    ${joinClause}

    ${whereClause ? whereClause + " AND" : "WHERE"} 1=1
    AND ${filterCondition}

    GROUP BY ${groupField}

    ORDER BY total_lead DESC;
  `;
};
