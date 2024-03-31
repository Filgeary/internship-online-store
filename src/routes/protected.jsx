import ChatPage from '../app/chat';
import Profile from '../app/profile';
import Protected from '../containers/protected';

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
