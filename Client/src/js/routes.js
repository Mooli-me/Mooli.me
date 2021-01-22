
import Main from '../pages/Main.svelte';
import Login from '../pages/Login.svelte';
import FirsRun from '../pages/FirstRun.svelte';
import SignOn from '../pages/SignOn.svelte';
import Peers from '../pages/Peers.svelte';
import Chat from '../pages/Chat.svelte';
import KnockKnock from '../pages/KnockKnock.svelte';

import { identity, session } from '../js/store.js';
var identityVal, sessionVal;

/**
 * It's necesary to use .suscribe store method becouse this is a .js file, not an .svlete one.
 * We can get store value by $storeName in thanks to Svelt compilation, but that .js file isn't compiled by Svelte.
 */
identity.subscribe(value => {
  identityVal = value;
});
session.subscribe(value => {
  sessionVal = value;
});

var routes = [
  /*{
    path: '/',
    redirect: function (route, resolve, reject) {
      if ( identityVal && sessionVal.loggedOn ) {
        resolve('/Main/');
      } 
      if ( identityVal && ! sessionVal.loggedOn ) {
        resolve('/Login/');
      } 
      if ( ! identityVal ) {
        resolve('/FirstRun/');
      }
    }
  },*/
  {
    path: '/',
    redirect: function (route, resolve, reject) {
      resolve( sessionVal.guest ? '/FirstRun/' : '/Login/');
    }
  },
  {
    path: '/Main/',
    component: Main,
  },
  {
    path: '/Login/',
    component: Login,
  },
  {
    path: '/FirstRun/',
    component: FirsRun,
  },
  {
    path: '/SignOn/',
    component: SignOn,
  },
  {
    path: '/Peers/:chatIdx/',
    component: Peers,
  },
  {
    path: '/Chat/:chatId/:destId/',
    component: Chat,
  },
  {
    path: '/:chatCode',
    component: KnockKnock,
  },
];

export default routes;
