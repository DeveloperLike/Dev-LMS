import { useEffect, useState } from "react";

const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains("dark");

    setIsDark(checkDark());

    const observer = new MutationObserver(() => {
      setIsDark(checkDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const colors = {
    grid: isDark ? "#374151" : "#e5e7eb",
    text: isDark ? "#9ca3af" : "#6b7280",
    tooltipBg: isDark ? "#111827" : "#ffffff",
    tooltipText: isDark ? "#ffffff" : "#111827",
    border: isDark ? "#374151" : "#e5e7eb",
  };

  return { isDark, colors };
};

export default useTheme;
