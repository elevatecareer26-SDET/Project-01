
import React from 'react';
import { KpiData } from '../types';

interface KpiCardProps {
  data: KpiData;
}

const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  const isTrendUp = data.trend?.startsWith('+');
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-5 border-t-4 shadow-sm hover:shadow-md transition-all duration-200" style={{ borderTopColor: data.color }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{data.label}</p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{data.value}</h3>
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: data.bgLight }}>
          <span className="material-icons text-xl" style={{ color: data.color }}>{data.icon}</span>
        </div>
      </div>
      {data.trend && (
        <div className="flex items-center text-sm">
          <span className={`font-semibold flex items-center ${isTrendUp ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            <span className="material-icons text-base mr-0.5">{isTrendUp ? 'trending_up' : 'trending_down'}</span>
            {data.trend}
          </span>
          <span className="text-slate-400 dark:text-slate-500 ml-2">{data.trendLabel}</span>
        </div>
      )}
      {!data.trend && data.trendLabel && (
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {data.trendLabel}
        </div>
      )}
    </div>
  );
};

export default KpiCard;
