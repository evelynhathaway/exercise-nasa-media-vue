// Simple truncation util, doesn't cut off words
export const truncate = (string, length) => {
  const regex = new RegExp(`^(.{${length}}[^\\s]*)(.*)`)
  return string.replace(regex, (match, truncated, remaining) => {
    return remaining ? truncated + "…" : truncated;
  });
}
