import { Router } from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';
const router = new Router();

router.post('/', controller.addUser);
router.get('/me', auth.isAuthenticated(), controller.getMe);
router.delete('/:id', controller.deleteUser);

export default router;
