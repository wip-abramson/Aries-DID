import * as Koa from 'koa';
import * as Router from 'koa-router';
import { RelationshipService } from './relationships.service';
import client from '../client';

const ctrl = client;

const routerOpts: Router.IRouterOptions = {
  prefix: '/relationships'
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  try {
    const params = ctx.query;
    if (params.id) {
      const res = await ctrl.connection.getConnections(params, params.id);
      ctx.body = res;
    } else {
      const res = await ctrl.connection.getConnections(params);
      ctx.body = res;
    }
  } catch (err) {
    ctx.throw(400, 'failed to get relationships');
  }
});

router.post('/', async (ctx: Koa.Context) => {
  try {
    // const invite = await relationship.createInvitation();
    // ctx.body = invite;
    ctx.body = 'new relationship';
  } catch (err) {
    ctx.status = 500;
    ctx.throw('invitation failed to create on the server');
  }
});

export default router;
