

import path from 'path';

import userRoutes from './api/User/user.routes';
import heroRoutes from './api/Hero/hero.routes';
import draftRoutes from './api/Draft/draft.routes';
import odRoutes from './api/OpenDota/od.routes';

import authRoutes from './auth/auth.routes';

export default function(app) {
  console.log('registering routes');
  app.use('/api/heroes', heroRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/draft', draftRoutes);
  app.use('/api/od', odRoutes);

  app.use('/auth', authRoutes);
  
  console.log('Using SPA');
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(app.get('appPath'), 'index.html'));
  });
}




