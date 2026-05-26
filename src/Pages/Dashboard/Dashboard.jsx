import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLeadFilters } from "../../lib/redux/leadFilterSlice";

import { dashboardConfig } from "./dashboardConfig";
import { useDashboardData } from "./useDashboardData";
import { DashboardCard } from "./DashboardCard";

export const Dashboard = () => {
  const { data, meta } = useDashboardData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const normalize = (str) => str?.toLowerCase().trim();

  const handleCardClick = (config) => {
    if (!data) return;

    if (config.dynamicRoute === "fresh") {
      dispatch(
        setLeadFilters({
          leads_status: meta?.fresh_lead_source_id,
        })
      );
      navigate(`/lead-filter/${meta?.fresh_lead_source_id}`);
      return;
    }

    if (config.route) {
      navigate(config.route, config.state ? { state: config.state } : {});
    }
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 xl:px-8 py-4 sm:py-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="
   grid
   grid-cols-[repeat(auto-fit,minmax(260px,1fr))]
   sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]
   xl:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]
   2xl:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]
   gap-5
   sm:gap-6
   w-full
   max-w-[1800px]
   mx-auto
   "
      >
        {dashboardConfig
          .filter((config) => {
            if (!data) return true;

            return data.some(
              (d) => normalize(d.name) === normalize(config.key)
            );
          })
          .map((config, index) => {
            const matchedItem = data?.find(
              (d) => normalize(d.name) === normalize(config.key)
            );

            const count = matchedItem?.count || 0;

            return (
              <motion.div
                key={index}
                className="w-full"
                variants={cardAnimation}
                whileHover={{
                  scale: 1.05,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                whileTap={{
                  scale: 0.95,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
              >
                <DashboardCard
                  config={config}
                  count={count}
                  data={data}
                  onClick={() => handleCardClick(config)}
                />
              </motion.div>
            );
          })}
      </motion.div>

      <style>
        {`
        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .animate-shimmer {
          animation: shimmer 1.6s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
};