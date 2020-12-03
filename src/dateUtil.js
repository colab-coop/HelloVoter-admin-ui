export const toISO8601 = (mdy) => {
  if (!mdy) {
    return mdy;
  }
  const parts = mdy.split("/");
  const year = parts.pop();
  parts.unshift(year);
  return parts.join("-");
};

export const toMDYSlashSeparated = (iso8601) => {
  if (!iso8601) {
    return iso8601;
  }
  const parts = iso8601.split("-");
  const year = parts.shift();
  parts.push(year);
  return parts.join("/");
};
