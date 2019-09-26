import * as Koa from 'koa';
import * as Router from 'koa-router';
import { InvitationService } from './invitations.service';
import { IConnectionParams } from '../../agent/modules/connection/connection.service';

const invitationSvc = new InvitationService();

const routerOpts: Router.IRouterOptions = {
  prefix: '/invitations'
};

const router: Router = new Router(routerOpts);

const invitationResponseKeys = [
  'connection_id',
  'invitation',
  'invitation_url'
];
const invitationKeys = ['@type', 'recipientkeys', 'label', 'serviceEndpoint'];

/* 
  get all of my external invitations
  parameters: state, initiator
*/

router.get('/', async (ctx: Koa.Context) => {
  const params = ctx.query;

  // console.log('ctx query');
  const res = await invitationSvc.getInvitations(params);
  ctx.body = res;
});

/*
  Create an invitation or respond to an invitation that has been sent to the
  client.
  Set the accept value to true to accept the invitation in the query params
  and include a body with the correct format
*/
router.post('/', async (ctx: Koa.Context) => {
  const params = ctx.query;
  const keys = Object.keys(params);
  if (keys.some(itm => itm === 'accept')) {
    const invite = ctx.request.body;
    try {
      const req = await invitationSvc.acceptInvitation(invite);
      ctx.body = req;
    } catch (err) {
      ctx.throw(401, 'invalid request');
    }
    return ctx.body;
  } else {
    try {
      const invite = await invitationSvc.createInvitation();
      ctx.body = invite;
    } catch (err) {
      ctx.status = 500;
      ctx.throw('invitation failed to create on the server');
    }
  }
});

router.post('/accept', async ctx => {
  const invite = ctx.body;
});

export default router;
