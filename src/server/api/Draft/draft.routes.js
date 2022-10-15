import { Router } from 'express';
import * as controller from './draft.controller';

const router = new Router();

router.post('/byWinrate', controller.getHeroRecommendationsByWinrate);
router.post('/', controller.getHeroRecommendations);

export default router;
