import React from 'react';
import StatCard from '../ui/StatCard';

const StatsGrid = ({ stats, loading = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          color={stat.color}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
