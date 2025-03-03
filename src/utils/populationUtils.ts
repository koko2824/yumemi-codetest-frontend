// 年号の表示
export const mockYears = [1980, 1990, 2000, 2010, 2020];

// Generate mock data for each prefecture
export const generateMockData = () => {
  return mockYears.map((year) => {
    return { year };
  });
};

// Generate a unique color for each prefecture
export const getLineColor = (index: number) => {
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#8AC926',
    '#1982C4',
    '#6A4C93',
    '#F94144',
  ];
  return colors[index % colors.length];
};
