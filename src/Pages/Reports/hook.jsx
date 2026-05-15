import { useEffect, useMemo, useState } from "react";
import { clStatusOptions, packageCodes, stStatusOptions } from "./dropdown";
import dayjs from "dayjs";

export function generateDatesFromStartOfMonth() {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const prevDate = new Date(today);
    prevDate.setDate(today.getDate() - i);
    const formattedDate = prevDate.toISOString().split("T")[0];
    dates.push(formattedDate);
  }

  return dates.reverse();
}

export function formatDateToDDMMM(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" }); // 'May', 'Jun', etc.

  return `${day} ${month}`;
}

export function getActiveMonths(year) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth(); // 0-based (Jan = 0)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Default to current year if not provided
  if (!year) year = currentYear;

  let endIndex;

  if (year < currentYear) {
    endIndex = 11; // Full year (Jan to Dec)
  } else if (year === currentYear) {
    endIndex = currentMonthIndex; // Jan to current month
  } else {
    return []; // Future year — no active months
  }

  return months.slice(0, endIndex + 1).map((name, index) => ({
    name,
    year,
    month: index + 1, // 1-based month number
  }));
}

export function getYearsFrom2020() {
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
}

export const buildCondition = (field, values, isNumeric = false) => {
  if (!values?.length) return "";

  const formattedValues = values
    .map((val) => {
      const cleanVal = String(val).replace(/'/g, "");
      return isNumeric ? cleanVal : `'${cleanVal}'`;
    })
    .join(",");

  return `${field} IN (${formattedValues})`;
};

export const getStudentStatusName = (code) => {
  const res = stStatusOptions.find((item) => item.value === code);
  return res?.label || res?.value;
};
export const getStudentPackageName = (code) => {
  const res = packageCodes.find((item) => item.value === code);
  return res?.label || res?.value;
};
export const getCourseName = (code) => {
  const res = clStatusOptions.find((item) => item.value === code);
  return res?.label || res?.value;
};

export const useMonthlyDateRanges = (range) => {
  const ranges = useMemo(() => {
    const isValidRange =
      Array.isArray(range) &&
      range.length === 2 &&
      range[0] &&
      range[1] &&
      dayjs(range[0], "YYYY-MM-DD", true).isValid() &&
      dayjs(range[1], "YYYY-MM-DD", true).isValid();

    if (isValidRange) {
      const startDate = dayjs(range[0]);
      const endDate = dayjs(range[1]);
      const result = [];

      let current = startDate.startOf("month");

      while (
        current.isBefore(endDate, "day") ||
        current.isSame(endDate, "month")
      ) {
        const start = current.isSame(startDate, "month")
          ? startDate
          : current.startOf("month");
        const end = current.isSame(endDate, "month")
          ? endDate
          : current.endOf("month");

        result.push({
          start: start.format("YYYY-MM-DD"),
          end: end.format("YYYY-MM-DD"),
        });

        current = current.add(1, "month");
      }

      return result;
    }

    // Fallback: last 12 full months including current partial month
    const result = [];
    const today = dayjs();
    const currentDay = today.date();

    for (let i = 0; i <= 11; i++) {
      const monthStart = today.subtract(i, "month").startOf("month");

      const start = monthStart;
      const end =
        i === 0
          ? currentDay === 1
            ? start
            : today
          : monthStart.endOf("month");

      result.push({
        start: start.format("YYYY-MM-DD"),
        end: end.format("YYYY-MM-DD"),
      });
    }

    return result.reverse(); // Optional: make it chronological
  }, [range?.[0], range?.[1]]); // depend specifically on dates

  return ranges;
};

export const getYearList = (startYear, endYear) => {
  if (
    typeof startYear !== "number" ||
    typeof endYear !== "number" ||
    isNaN(startYear) ||
    isNaN(endYear)
  ) {
    return [];
  }

  const from = Math.min(startYear, endYear);
  const to = Math.max(startYear, endYear);
  const years = [];

  for (let year = to; year >= from; year--) {
    years.push(year);
  }

  return years;
};

export function getDateRange(months) {
  const today = new Date();

  // End date = end of current month
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const endDate = end.toISOString().split("T")[0];

  // Start date = 1st of the month N months ago
  const start = new Date(today.getFullYear(), today.getMonth() - months + 1, 1);
  const startDate = start.toISOString().split("T")[0];

  return [startDate, endDate];
}

export function useCountUp(
  value,
  duration = 800
) {
  const [displayValue, setDisplayValue] =
    useState(null);

  useEffect(() => {
    if (
      typeof value !== "number" ||
      value === undefined ||
      value === null
    ) {
      setDisplayValue(null);
      return;
    }

    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTimestamp) /
        duration,
        1
      );

      const currentValue = Math.floor(
        progress * value
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return displayValue;
}
export const removeZeroColumns = (columns, data) => {
  return columns
    .map((col) => {
      if (col.dataIndex === "branch_name") return col;

      if (col.title === "Total Lead") return col;

      if (col.children) {
        const isAllZero = col.children.every((child) => {
          return data.every((row) => Number(row[child.dataIndex] || 0) === 0);
        });

        if (isAllZero) return null;

        return col;
      }

      return data.some((row) => Number(row[col.dataIndex] || 0) !== 0)
        ? col
        : null;
    })
    .filter(Boolean);
};

export const sortColumnsByTotal = (columns, data) => {
  const fixedCols = [];
  const dynamicCols = [];

  columns.forEach((col) => {
    if (col.dataIndex === "branch_name" || col.title === "Total Lead") {
      fixedCols.push(col);
    } else {
      dynamicCols.push(col);
    }
  });

  const getTotal = (col) => {
    //CASE 1: Group columns (source group table)
    if (col.children) {
      const totalField = col.children.find((c) =>
        c.dataIndex?.endsWith("_total"),
      );

      if (!totalField) return 0;

      return data.reduce(
        (sum, row) => sum + Number(row[totalField.dataIndex] || 0),
        0,
      );
    }

    //CASE 2: Flat columns (status table)
    if (col.dataIndex) {
      return data.reduce(
        (sum, row) => sum + Number(row[col.dataIndex] || 0),
        0,
      );
    }

    return 0;
  };

  dynamicCols.sort((a, b) => getTotal(b) - getTotal(a));

  return [...fixedCols, ...dynamicCols];
};

export const useLeadConversion = () => {
  const getMqlColor = (percent) => {
    if (percent > 50) return "text-green-500";
    if (percent >= 35) return "text-yellow-500";
    return "text-red-600";
  };

  const getSqlColor = (percent) => {
    if (percent > 50) return "text-green-500";
    if (percent >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getMqlPercent = (mql, totalLead) => {
    if (!totalLead || totalLead === 0) return 0;

    const percent = (mql / totalLead) * 100;

    if (!isFinite(percent) || isNaN(percent)) return 0;

    return Math.round(percent);
  };

  const getSqlPercent = (sql, mql) => {
    if (!mql || mql === 0) return 0;

    const percent = (sql / mql) * 100;

    if (!isFinite(percent) || isNaN(percent)) return 0;

    return Math.round(percent);
  };

  const getMqlData = (mql, totalLead) => {
    const percent = getMqlPercent(mql, totalLead);

    return {
      value: mql,
      percent,
      color: getMqlColor(percent),
    };
  };

  const getSqlData = (sql, mql) => {
    const percent = getSqlPercent(sql, mql);

    return {
      value: sql,
      percent,
      color: getSqlColor(percent),
    };
  };

  return {
    getMqlColor,
    getSqlColor,
    getMqlData,
    getSqlData,
    getMqlPercent,
    getSqlPercent,
  };
};

export const useRegisteredPercentage = () => {
  const getColor = (percent) => {
    if (percent > 50) return "text-green-500";
    if (percent > 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getPercentData = (val) => {
    const raw = Number(val || 0);
    const formatted = raw.toFixed(2);

    return {
      percent: formatted,
      color: getColor(raw),
    };
  };

  const renderPercent = (val) => {
    const { percent, color } = getPercentData(val);

    return (
      <span className={`${color} font-semibold`}>
        {percent}%
      </span>
    );
  };

  return {
    getColor,
    getPercentData,
    renderPercent,
  };
};

export const useReversePercentageColor = () => {
  const getColor = (percent) => {
    if (percent < 30) return "text-green-500";
    if (percent <= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const formatPercent = (val) => {
    return Math.round(val || 0);
  };

  const getPercentData = (val) => {
    const percent = formatPercent(val);

    return {
      percent,
      color: getColor(percent),
    };
  };

  const renderPercent = (val) => {
    const { percent, color } = getPercentData(val);

    return <span className={`${color} font-semibold`}>{percent}%</span>;
  };

  return {
    getColor,
    formatPercent,
    getPercentData,
    renderPercent,
  };
};