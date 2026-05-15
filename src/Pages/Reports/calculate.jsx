export const getPercentage = (total, count) => {
  // invalid or zero total
  if (!total || isNaN(total) || total <= 0) {
    return null;
  }

  const num = (count / total) * 100;
  const rounded = Math.round(num); // no decimals

  let color = "blue";
  if (rounded <= 50) {
    color = "red";
  } else if (rounded >= 95) {
    color = "green";
  }

  return <span className="ms-2" style={{ color }}>({`${rounded}%`})</span>;
};
export const countPercentage = (total, count) => {
  // invalid or zero total
  if (!total || isNaN(total) || total <= 0) {
    return null;
  }

  const num = (count / total) * 100;
  const rounded = Math.round(num); // no decimals

  return rounded;
};