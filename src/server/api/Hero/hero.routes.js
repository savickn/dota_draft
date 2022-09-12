import { Router } from 'express';
import * as controller from './hero.controller';

const router = new Router();

router.post('/', controller.addHero);
router.get('/', controller.getHeroes);
router.get('/:id', controller.getHero);
router.put('/:id', controller.updateHero);
//router.delete('/:id', controller.deleteHero);

export default router;
