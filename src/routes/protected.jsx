import { lazy } from 'react';

const ChatPage = lazy(() => import('../app/chat'));
const Profile = lazy(() => import('../app/profile'));
const Protected = lazy(() => import('../containers/protected'));

export const protectedRoutes = [
  {
    path: '/profile',
    element: {
      render: () => (
        <Protected redirect='/login'>
          <Profile />
        </Protected>
      ),
    },
  },
  {
    path: '/chat',
    element: {
      render: () => (
        <Protected redirect='/login'>
          <ChatPage />
        </Protected>
      ),
    },
  },
];
