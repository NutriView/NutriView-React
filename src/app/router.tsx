import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppShell';
import { RequireAuth } from '../features/auth/RequireAuth';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DailyLogPage } from '../features/food-entries/DailyLogPage';
import { FoodsPage } from '../features/foods/FoodsPage';
import { GoalPage } from '../features/nutrition-goal/GoalPage';
import { RemindersPage } from '../features/reminders/RemindersPage';
import { ProfilePage } from '../features/profile/ProfilePage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DailyLogPage /> },
          { path: '/foods', element: <FoodsPage /> },
          { path: '/goal', element: <GoalPage /> },
          { path: '/reminders', element: <RemindersPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
