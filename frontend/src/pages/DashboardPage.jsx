import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sidebar } from '../components/Sidebar';
import { Card, StatCard } from '../components/Card';
import { LoadingSpinner } from '../components/Alerts';
import { userAPI } from '../services/api';
import { setStats } from '../store/slices/userSlice';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector(state => state.user);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userAPI.getStats();
        dispatch(setStats(response.data.data));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Courses" value={stats?.totalCourses || 0} />
          <StatCard label="Completed" value={stats?.completedCourses || 0} />
          <StatCard label="Badges Earned" value={stats?.badges || 0} />
          <StatCard label="Current Streak" value={stats?.currentStreak || 0} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Recent Activity">
            <p className="text-gray-600">No recent activity</p>
          </Card>
          
          <Card title="Recommended Courses">
            <p className="text-gray-600">Loading recommendations...</p>
          </Card>
        </div>
      </main>
    </div>
  );
};
