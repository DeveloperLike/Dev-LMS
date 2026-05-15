export const getBranchStatusQuery = ({ whereClause, statuses }) => `
SELECT
    COALESCE(bmb.name,'Others') AS branch_name,

    COUNT(*) AS total_lead,

    COUNT(*) FILTER (
        WHERE bl.lead_status_id = '0233cefc-fb3e-49d5-9ee1-5f8adadf143a'
        AND bl.last_updated <= NOW() - INTERVAL '30 minutes'
    ) AS "stale_fresh_leads",

    ${statuses
      .map((s) => {
        const safeName = s.name.replace(/'/g, "''");
        const key = s.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

        return `
        COUNT(*) FILTER (
            WHERE lms.name='${safeName}'
        ) AS "${key}"
        `;
      })
      .join(",")}

FROM (
    SELECT DISTINCT
        lml.id,
        lml.assign_to_id,
        lml.lead_status_id,
        lml.lead_source_id,
        lml.last_updated
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

LEFT JOIN lead_management_leadstatus lms
ON bl.lead_status_id = lms.id

GROUP BY COALESCE(bmb.name,'Others')

ORDER BY
(COALESCE(bmb.name,'Others')='Others'),
COALESCE(bmb.name,'Others');
`;

export const getBranchSourceQuery = ({ whereClause, sourceGroups }) => `
SELECT
    COALESCE(bmb.name,'Others') AS branch_name,

    COUNT(*) AS total_lead,
    
    COUNT(*) FILTER (
        WHERE bl.interest_count > 0
    ) AS total_mql,
    
    COUNT(*) FILTER (
        WHERE (bl.vc_count > 0 OR bl.visit_count > 0)
    ) AS total_sql,
    
    COUNT(*) FILTER (
        WHERE app.lead_id IS NOT NULL
    ) AS total_registered,

    ${sourceGroups
      .map((s) => {
        const safeGroup = s.source_group.replace(/'/g, "''");
        const key = s.source_group
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");

        return `
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${safeGroup}'
            ) AS "${key}_total",
    
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${safeGroup}'
                AND bl.interest_count > 0
            ) AS "${key}_mql",
            
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${safeGroup}'
                AND (bl.vc_count > 0 OR bl.visit_count > 0)
            ) AS "${key}_sql",
            
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${safeGroup}'
                AND app.lead_id IS NOT NULL
            ) AS "${key}_registered"
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
       lml.status
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

export const getBranchRegisteredAtQuery = ({
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
        const safeGroup = s.source_group.replace(/'/g, "''");

        const key = s.source_group
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");

        return `
                COUNT(DISTINCT CASE
                    WHEN COALESCE(lmls.source_group,'Others')='${safeGroup}'
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

export const getCounsellorSourceQuery = ({ whereClause, sourceGroups }) => `
SELECT
    COALESCE(u.full_name,'Others') AS user_name,

    COUNT(*) AS total_lead,
    
    COUNT(*) FILTER (
        WHERE bl.interest_count > 0
    ) AS total_mql,
    
    COUNT(*) FILTER (
        WHERE (bl.vc_count > 0 OR bl.visit_count > 0)
    ) AS total_sql,
    
    COUNT(*) FILTER (
        WHERE app.lead_id IS NOT NULL
    ) AS total_registered,

    ${sourceGroups
      .map((s) => {
        const safeGroup = s.source_group.replace(/'/g, "''");
        const key = s.source_group
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");

        return `
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${safeGroup}'
            ) AS "${key}_total",
    
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${safeGroup}'
                AND bl.interest_count > 0
            ) AS "${key}_mql",
            
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${safeGroup}'
                AND (bl.vc_count > 0 OR bl.visit_count > 0)
            ) AS "${key}_sql",
            
            COUNT(*) FILTER (
                WHERE COALESCE(lmls.source_group,'Others')='${safeGroup}'
                AND app.lead_id IS NOT NULL
            ) AS "${key}_registered"
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
       lml.visit_count
   FROM lead_management_lead lml
   ${whereClause}
) bl

LEFT JOIN user_management_user u
ON bl.assign_to_id = u.username

LEFT JOIN lead_management_leadsource lmls
ON bl.lead_source_id = lmls.id

LEFT JOIN (
    SELECT DISTINCT lead_id
    FROM accounting_packagepurchased
) app 
ON app.lead_id = bl.id

GROUP BY COALESCE(u.full_name,'Others')

ORDER BY total_lead DESC
`;

export const getCounsellorRegisteredAtQuery = ({
  whereClauseWithoutDate,
  sourceGroups,
  regStartDate,
  regEndDate,
}) => `

SELECT
    COALESCE(u.full_name,'Others') AS user_name,

    COUNT(DISTINCT app.lead_id) AS total_registered_at,

    ${sourceGroups
      .map((s) => {
        const safeGroup = s.source_group.replace(/'/g, "''");

        const key = s.source_group
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");

        return `
                COUNT(DISTINCT CASE
                    WHEN COALESCE(lmls.source_group,'Others')='${safeGroup}'
                    THEN app.lead_id
                END) AS "${key}_registered_at"
            `;
      })
      .join(",")}

FROM accounting_packagepurchased app

INNER JOIN lead_management_lead lml
ON lml.id = app.lead_id

LEFT JOIN user_management_user u
ON lml.assign_to_id = u.username

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

GROUP BY COALESCE(u.full_name,'Others')

ORDER BY total_registered_at DESC
`;

export const getBranchMqlSqlQuery = ({ whereClause }) => `
SELECT
    COALESCE(bmb.name,'Others') AS branch_name,

    COUNT(*) AS total_lead,

    COUNT(*) FILTER (
        WHERE bl.interest_count > 0
    ) AS mql,

    COUNT(*) FILTER (
        WHERE bl.vc_count > 0
        OR bl.visit_count > 0
    ) AS sql

FROM (
    SELECT DISTINCT
        lml.id,
        lml.assign_to_id,
        lml.lead_source_id,
        lml.interest_count,
        lml.vc_count,
        lml.visit_count
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

GROUP BY COALESCE(bmb.name,'Others')

ORDER BY
(COALESCE(bmb.name,'Others')='Others'),
COALESCE(bmb.name,'Others')
`;

export const getCounsellorMqlSqlQuery = ({ whereClause }) => `
SELECT
    COALESCE(umu.full_name, 'Unassigned') AS user_name,

    COUNT(DISTINCT lml.id) AS total_lead,

    COUNT(DISTINCT CASE
        WHEN lml.interest_count > 0
        THEN lml.id
    END) AS mql,

    COUNT(DISTINCT CASE
        WHEN lml.vc_count > 0
        OR lml.visit_count > 0
        THEN lml.id
    END) AS sql

FROM lead_management_lead lml

LEFT JOIN user_management_user umu
    ON lml.assign_to_id = umu.username

LEFT JOIN user_management_user_branch umub
    ON umub.user_id = umu.username

LEFT JOIN branch_management_branch bmb
    ON umub.branch_id = bmb.id

LEFT JOIN lead_management_leadsource lmls
    ON lml.lead_source_id = lmls.id

${whereClause}

GROUP BY COALESCE(umu.full_name, 'Unassigned')

ORDER BY total_lead DESC
`;

export const getBranchUserStatusQuery = ({ whereClause, statuses }) => `
SELECT
    COALESCE(umu.full_name,'Unassigned') AS user_name,

    COUNT(*) AS total_lead,

    ${statuses
      .map((s) => {
        const safeName = s.name.replace(/'/g, "''");
        const key = s.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

        return `
        COUNT(*) FILTER (WHERE lms.name='${safeName}') AS "${key}"
        `;
      })
      .join(",")}

FROM (
    SELECT DISTINCT
        lml.id,
        lml.assign_to_id,
        lml.lead_status_id,
        lml.lead_source_id
    FROM lead_management_lead lml
    ${whereClause}
) bl

LEFT JOIN user_management_user umu
    ON bl.assign_to_id = umu.username

LEFT JOIN lead_management_leadstatus lms
    ON bl.lead_status_id = lms.id

GROUP BY COALESCE(umu.full_name,'Unassigned')

ORDER BY total_lead DESC
`;
