import Login from '../pages/Login.svelte';
import Home from '../pages/Home.svelte';
import SignOn from '../pages/SignOn.svelte';
import Peers from '../pages/Peers.svelte';
import ChatInfo from '../pages/ChatInfo.svelte';
import Chat from '../pages/Chat.svelte';
import KnockKnock from '../pages/KnockKnock.svelte';
import CustomName from '../pages/CustomName.svelte';

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
    component: Login,
  },
  {
    path: '/Home/',
    component: Home,
    /*redirect: function (route, resolve, reject) {
      resolve( sessionVal.guest ? '/FirstRun/' : '/Login/');
    }*/
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
    path: '/ChatInfo/:chatId/',
    component: ChatInfo,
  },
  {
    path: '/Chat/:chatId/:destId/',
    component: Chat,
  },
  {
    path: '/CustomName/:id/',
    component: CustomName,
  },
  {
    path: '/:chatCode',
    component: KnockKnock,
  },
];

export default routes;
