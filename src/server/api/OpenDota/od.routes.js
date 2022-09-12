
import { Router } from 'express';
import * as controller from './od.controller';

const router = new Router();

router.get('/heroes', controller.getHeroes);
router.get('/abilities', controller.getAbilities);
router.get('/items', controller.getItems);
router.get('/heroItems/:id', controller.getPopularItems);
router.get('/heroMatchups/:id', controller.getMatchups);

export default router;
