export const truncateString = (str:string) => {
  if (str.length <= 50) return str;
  return str.slice(0, 50) + '...';
};