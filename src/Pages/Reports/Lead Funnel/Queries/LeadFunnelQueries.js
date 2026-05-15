export const getDistributedSourceLeadsQuery = ({
  startUTC,
  endUTC,
  userCondition,
  branchCondition,
  sourceGroupCondition,
  leadSourceCondition,
}) => `
SELECT 
  bl.lead_source_id,
  COALESCE(lmls.source_group,'Others') AS source_group,

  COUNT(*) AS totalleads,

  COUNT(*) FILTER (
    WHERE bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
  ) AS junk,

  COUNT(*) FILTER (
    WHERE bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
    AND COALESCE(bl.interest_count, 0) = 0
  ) AS marketing_junk,

  COUNT(*) FILTER (
    WHERE bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
    AND bl.created_at::date BETWEEN DATE('${startUTC}') AND DATE('${endUTC}')
  ) AS junk_one_day,

  COUNT(*) FILTER (
    WHERE bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
    AND (bl.last_updated::date - bl.created_at::date) BETWEEN 2 AND 5
  ) AS diff_2_to_5_days,

  COUNT(*) FILTER (
    WHERE bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
    AND (bl.last_updated::date - bl.created_at::date) BETWEEN 6 AND 7
  ) AS diff_5_to_7_days,

  COUNT(*) FILTER (
    WHERE bl.lead_status_id = '07bb794f-f085-464d-ba4b-ca50defdc3da'
    AND (bl.last_updated::date - bl.created_at::date) > 7
  ) AS more_7days,

  COUNT(DISTINCT bl.id) FILTER (
    WHERE bl.lead_status_id = '4b3428a2-18f5-47ec-a842-ae732ac7c9cb'
  ) AS dnp,
  
  COUNT(DISTINCT bl.id) FILTER (
    WHERE bl.lead_status_id = '4b3428a2-18f5-47ec-a842-ae732ac7c9cb'
    AND (bl.last_updated::date - bl.created_at::date) BETWEEN 0 AND 3
  ) AS dnp_0_3,
  
  COUNT(DISTINCT bl.id) FILTER (
    WHERE bl.lead_status_id = '4b3428a2-18f5-47ec-a842-ae732ac7c9cb'
    AND (bl.last_updated::date - bl.created_at::date) >= 4
  ) AS dnp_4_plus

FROM (
  SELECT DISTINCT
      lml.id,
      lml.lead_source_id,
      lml.lead_status_id,
      lml.created_at,
      lml.last_updated,
      lml.last_sub_status_id,
      lml.interest_count
  FROM lead_management_lead lml
  WHERE 1=1
  ${startUTC && endUTC ? `AND lml.created_at BETWEEN '${startUTC}' AND '${endUTC}'` : ""}
  ${userCondition}
  ${branchCondition}
) bl

LEFT JOIN lead_management_leadsource lmls
ON bl.lead_source_id = lmls.id

LEFT JOIN lead_management_leadsubstatus lmlss
ON lmlss.id = bl.last_sub_status_id

WHERE 1=1
${sourceGroupCondition}
${leadSourceCondition}

GROUP BY
  bl.lead_source_id,
  COALESCE(lmls.source_group,'Others')

ORDER BY COALESCE(lmls.source_group,'Others'), totalleads DESC;
`;

export const getLeadsStatusCountQuery = ({
  startDate,
  endDate,
  counsellorCondition,
  leadSourceCondition,
  sourceGroupCondition,
  userCondition,
  branchCondition,
}) => `

SELECT 
  COALESCE(umu.full_name, 'Unassigned') AS user_name,

  COUNT(DISTINCT lml_statuslog.lead_id) AS total_leads,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = 'a4c540ed-8a19-4e16-a22e-7e56b3130071'
    THEN lml_statuslog.lead_id END) AS counselled,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = '5770cdf2-81ab-4447-ab40-7d6c078b51bf'
    THEN lml_statuslog.lead_id END) AS vc_schedule,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = '319a91a8-8eaa-487b-b4c8-9021780ace1f'
    THEN lml_statuslog.lead_id END) AS vc_reschedule,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = '4692cd65-8c13-4829-9655-6ba93911be7d'
    THEN lml_statuslog.lead_id END) AS vc_condcted,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = 'c5883351-f2d9-4d06-83cd-5541d84f6f97'
    THEN lml_statuslog.lead_id END) AS visit_schedule,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = '417fa5cf-b960-4279-9dd1-758bbb331b4c'
    THEN lml_statuslog.lead_id END) AS visit_reschedule,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = '1faa19e7-2315-4d99-bafb-4cf2b08efa13'
    THEN lml_statuslog.lead_id END) AS visit_done,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = '19905cbc-9c5a-413b-81b3-77a500c5ebfc'
    THEN lml_statuslog.lead_id END) AS future_leads,

  COUNT(DISTINCT CASE 
    WHEN lml_statuslog.lead_sub_status_id = 'cb76d3f9-53f2-42a7-a50c-aed6813ac2a3'
    THEN lml_statuslog.lead_id END) AS registered

FROM lead_management_leadstatuslogs lml_statuslog

LEFT JOIN lead_management_lead lml 
  ON lml.id = lml_statuslog.lead_id

LEFT JOIN lead_management_leadsource lmls
  ON lmls.id = lml.lead_source_id

LEFT JOIN user_management_user umu 
  ON umu.username = lml_statuslog.updated_by_id

LEFT JOIN user_management_user_branch umb 
  ON umb.user_id = lml_statuslog.updated_by_id

LEFT JOIN branch_management_branch bmb 
  ON umb.branch_id = bmb.id

WHERE 1=1

${
  startDate && endDate
    ? `AND lml_statuslog.created_at::date BETWEEN '${startDate}' AND '${endDate}'`
    : ""
}

${counsellorCondition}
${leadSourceCondition}
${sourceGroupCondition}
${userCondition}
${branchCondition}

GROUP BY COALESCE(umu.full_name, 'Unassigned')

ORDER BY total_leads DESC

`;

export const getFollowupTotalCountQuery = ({ users, totalBranchCondition }) => `
SELECT COUNT(*) AS total
FROM (
    SELECT lml.assign_to_id, umu.full_name
    FROM lead_management_followup lml_follow_up
    LEFT JOIN lead_management_lead lml ON lml.id = lml_follow_up.lead_id
    LEFT JOIN user_management_user umu ON umu.username = lml.assign_to_id

    WHERE 
        lml_follow_up.date::date <= CURRENT_DATE
        AND umu.username IN (${users})
        ${totalBranchCondition}

    GROUP BY lml.assign_to_id, umu.full_name
) t
`;

export const getFollowupLeadsQuery = ({
  users,
  branchCondition,
  where,
  offset,
  pageSize,
}) => `
SELECT 
    s.assign_to_id AS user_id, 
    umu.full_name AS user_name, 

    jsonb_object_agg(
        s.lead_status, 
        s.status_count
    ) AS status_summary,

    SUM(s.status_count) AS total_count

FROM (
    SELECT 
        lml.assign_to_id, 
        lml_follow_up.lead_status, 
        COUNT(*) AS status_count 
    FROM lead_management_followup lml_follow_up 
    LEFT JOIN lead_management_lead lml 
        ON lml.id = lml_follow_up.lead_id 
    WHERE 
        lml_follow_up.lead_status IS NOT NULL 
        AND lml_follow_up.date::date <= CURRENT_DATE
        AND lml_follow_up.status = false
    GROUP BY lml.assign_to_id, lml_follow_up.lead_status
) s 

LEFT JOIN user_management_user umu 
    ON umu.username = s.assign_to_id

LEFT JOIN user_management_user_branch umb 
    ON umb.user_id = umu.username

WHERE s.assign_to_id IS NOT NULL 
${where}
AND umu.username IN (${users})
${branchCondition}

GROUP BY s.assign_to_id, umu.full_name

ORDER BY SUM(s.status_count) DESC

LIMIT ${pageSize} OFFSET ${offset}
`;

export const getFollowupSummaryQuery = ({ users, totalBranchCondition }) => `
SELECT 
    jsonb_object_agg(lead_status, status_count) AS status_summary
FROM (
    SELECT 
        lml_follow_up.lead_status,
        COUNT(*) AS status_count
    FROM lead_management_followup lml_follow_up
    LEFT JOIN lead_management_lead lml 
        ON lml.id = lml_follow_up.lead_id
    LEFT JOIN user_management_user umu 
        ON umu.username = lml.assign_to_id

    WHERE 
        lml_follow_up.lead_status IS NOT NULL
        AND lml_follow_up.date::date <= CURRENT_DATE
        AND lml_follow_up.status = false
        AND umu.username IN (${users})
        ${totalBranchCondition}

    GROUP BY lml_follow_up.lead_status
) t
`;
