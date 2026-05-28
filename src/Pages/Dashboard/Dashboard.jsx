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
        delayChildren: 0.12,
      },
    },
  };

  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.94,
      filter: "blur(8px)",
    },

    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",

      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="w-full px-4 md:px-5 xl:px-6 py-5">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
        gap-5
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
                variants={cardAnimation}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                className="group"
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
    </div>
  );
};