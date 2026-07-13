import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/Alerts';
import { courseAPI } from '../services/api';
import { setCourses } from '../store/slices/courseSlice';

export const CoursesPage = () => {
  const dispatch = useDispatch();
  const { courses, isLoading } = useSelector(state => state.courses);
  const [level, setLevel] = React.useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses({ level: level || undefined });
        dispatch(setCourses(response.data.data));
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [dispatch, level]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cybersecurity Courses</h1>
        
        <div className="mb-6 flex gap-4">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="input w-48"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                  <span className="text-sm text-gray-600">⭐ {course.rating || 'N/A'}</span>
                </div>
                <Button variant="primary" className="w-full">
                  Enroll Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
