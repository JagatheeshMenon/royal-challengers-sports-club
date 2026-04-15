import { motion } from 'motion/react';
import { Sparkles, CalendarDays, ImagePlus } from 'lucide-react';

export default function OverviewCards({ highlightsCount = 0 }: { highlightsCount?: number }) {
  const stats = [
    {
      label: "Total Highlights",
      value: highlightsCount.toString(),
      change: "+12%",
      icon: Sparkles,
      color: "bg-white",
      textColor: "text-primary"
    },
    {
      label: "Upcoming Matches",
      value: "08",
      subtext: "Next: Tomorrow",
      icon: CalendarDays,
      color: "bg-primary",
      textColor: "text-white"
    },
    {
      label: "Gallery Media Count",
      value: "2,842",
      subtext: "4.2 TB storage used",
      icon: ImagePlus,
      color: "bg-white",
      textColor: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.color} p-8 rounded-xl shadow-sm border border-surface-container-high flex flex-col justify-between min-h-[180px]`}
        >
          <div className="flex justify-between items-start">
            <div className={`p-2 rounded-lg ${stat.color === 'bg-primary' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-primary'}`}>
              <stat.icon size={24} />
            </div>
            {stat.change && (
              <span className="text-green-500 font-bold text-sm">{stat.change}</span>
            )}
          </div>
          
          <div>
            <p className={`font-label text-[10px] font-black uppercase tracking-widest mb-1 ${stat.textColor === 'text-white' ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-5xl font-black font-headline ${stat.textColor}`}>{stat.value}</h3>
              {stat.subtext && (
                <span className={`text-xs font-medium ${stat.textColor === 'text-white' ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>
                  {stat.subtext}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
