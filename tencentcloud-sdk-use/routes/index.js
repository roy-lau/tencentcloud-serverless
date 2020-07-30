const Router = require('koa-router');
const tencentcloud = require('./tencentcloud');


const router = new Router();

router.use(tencentcloud.routes());

module.exports = router;
