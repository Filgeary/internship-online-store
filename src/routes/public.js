import Article from '../app/article';
import CanvasPage from '../app/canvas';
import Login from '../app/login';
import Main from '../app/main';

export const publicRoutes = [
  {
    path: '',
    element: Main,
  },
  {
    path: '/canvas',
    element: CanvasPage,
  },
  {
    path: '/articles/:id',
    element: Article,
  },
  {
    path: '/login',
    element: Login,
  },
];
