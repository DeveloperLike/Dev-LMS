import axios from "axios";
import { baseurl } from "../../../../lib/Constants";

// ================= AXIOS =================
const api = axios.create({
  baseURL: baseurl + "/facebook",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= ERROR =================
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err?.response || err.message);
    return Promise.reject(err);
  },
);

// ================= HELPERS =================
const getLeadsFromActions = (actions = []) => {
  if (!Array.isArray(actions)) return 0;

  return actions.reduce((sum, a) => {
    if (
      a.action_type === "lead" ||
      a.action_type === "onsite_conversion.lead" ||
      a.action_type === "offsite_conversion.fb_pixel_lead"
    ) {
      return sum + Number(a.value || 0);
    }
    return sum;
  }, 0);
};

// ================= NORMALIZE =================
const normalizeCampaigns = (account, campaigns = []) => {
  const result = [];

  campaigns.forEach((c) => {
    const insights = c?.insights?.data || [];

    if (!Array.isArray(insights) || insights.length === 0) return;

    insights.forEach((ins) => {
      const spend = Number(Number(ins?.spend || 0).toFixed(0));
      const impressions = Number(ins?.impressions || 0);
      const clicks = Number(ins?.clicks || 0);
      const ctr = Number(ins?.ctr || 0);
      const leads = getLeadsFromActions(ins?.actions);
      const date = ins?.date_start || null;

      result.push({
        id: `${account.uid}-${c.id}-${date}`,
        accountId: account.uid,
        accountName: account.name,

        name: ins?.campaign_name || c?.name || "Unnamed Campaign",

        adset_name: ins?.adset_name || "Unknown Ad Set",
        ad_name: ins?.ad_name || "Unknown Ad",

        spend,
        impressions,
        clicks,
        ctr,
        leads,
        date,
        cpc: clicks ? Number((spend / clicks).toFixed(2)) : 0,
      });
    });
  });

  return result;
};

// ================= KPI =================
const calculateKPI = (campaigns = []) => {
  const totals = campaigns.reduce(
    (acc, c) => {
      acc.spend += c.spend || 0;
      acc.impressions += c.impressions || 0;
      acc.clicks += c.clicks || 0;
      acc.leads += c.leads || 0;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, leads: 0 },
  );

  return {
    ...totals,
    ctr: totals.impressions
      ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2))
      : 0,
    cpc: totals.clicks ? Number((totals.spend / totals.clicks).toFixed(2)) : 0,
  };
};

// ================= MAIN =================
export const fetchDashboardData = async (filters = {}, signal) => {
  try {
    const accRes = await api.post("/getNamesOfAdAccount", {}, { signal });

    const accounts = accRes?.data?.names || [];

    if (!accounts.length) {
      return {
        campaigns: [],
        kpi: calculateKPI([]),
      };
    }

    const uids = accounts.map((a) => a.uid);

    let allAccountsData = [];

    try {
      const res = await api.post("/getAdData", { uids }, { signal });

      const raw = res?.data;

      if (Array.isArray(raw)) {
        allAccountsData = raw;
      } else if (Array.isArray(raw?.data)) {
        allAccountsData = raw.data;
      } else if (raw && typeof raw === "object") {
        allAccountsData = [raw];
      }
    } catch (error) {
      console.log("⚠️ BULK FAILED → FALLBACK");
    }

    if (allAccountsData.length === 0) {
      const responses = await Promise.all(
        accounts.map(async (acc) => {
          try {
            const res = await api.post(
              "/getAdData",
              { uid: acc.uid },
              { signal },
            );

            const data = res?.data;

            if (
              !data ||
              typeof data === "string" ||
              !Array.isArray(data.campaigns)
            ) {
              return null;
            }

            return data;
          } catch {
            return null;
          }
        }),
      );

      allAccountsData = responses.filter(Boolean);
    }

    let allCampaigns = [];

    allAccountsData.forEach((acc) => {
      const campaigns = Array.isArray(acc?.campaigns) ? acc.campaigns : [];

      const normalized = normalizeCampaigns(acc, campaigns);

      allCampaigns.push(...normalized);
    });
    const kpi = calculateKPI(allCampaigns);

    return {
      campaigns: allCampaigns,
      kpi,
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);

    return {
      campaigns: [],
      kpi: calculateKPI([]),
    };
  }
};
