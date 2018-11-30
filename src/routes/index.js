
import expressRouter from 'express';

const router = expressRouter.Router();

router.use('/api', require('./api'));

export default router;
