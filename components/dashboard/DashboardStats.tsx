'use client';

import { FileText, Eye, Download, Users } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    total: number;
    published: number;
    views: number;
    downloads: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'إجمالي السير الذاتية',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'منشورة',
      value: stats.published,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'عدد المشاهدات',
      value: stats.views,
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      title: 'مرات التحميل',
      value: stats.downloads,
      icon: Download,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition"
        >
          <div>
            <p className="text-gray-600 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
          <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
            <stat.icon className={`${stat.color.replace('bg-', 'text-')}`} size={24} />
          </div>
        </div>
      ))}
    </div>
  );
}