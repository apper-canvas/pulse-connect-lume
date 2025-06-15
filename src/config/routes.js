import Home from '@/components/pages/Home';
import Explore from '@/components/pages/Explore';
import Messages from '@/components/pages/Messages';
import Profile from '@/components/pages/Profile';
import CreatePost from '@/components/pages/CreatePost';
import Settings from '@/components/pages/Settings';

const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  explore: {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: 'Search',
    component: Explore
  },
  create: {
    id: 'create',
    label: 'Create',
    path: '/create',
    icon: 'Plus',
    component: CreatePost
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
    component: Messages
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;