export const getPageWiseLeadQuery = ({ whereClause }) => `
SELECT
    LOWER(
        REPLACE(
            REPLACE(
                COALESCE(turl.name, ''),
                'https://', ''
            ),
            'www.', ''
        )
    ) AS page,

    COUNT(*) AS total_lead

FROM lead_management_lead lml

LEFT JOIN lead_management_trackingurl turl
    ON lml.tracking_url_id = turl.id

${whereClause ? whereClause + " AND" : "WHERE"}
turl.name IS NOT NULL

GROUP BY 
    LOWER(
        REPLACE(
            REPLACE(
                COALESCE(turl.name, ''),
                'https://', ''
            ),
            'www.', ''
        )
    )

ORDER BY total_lead DESC;
`;
