
import Main from '../pages/Main.svelte';
import Login from '../pages/Login.svelte';
import FirsRun from '../pages/FirstRun.svelte';

import { identity, chats, session } from '../js/store.js';
var identityVal, chatsVal, sessionVal;

/**
 * It's necesary to use .suscribe store method becouse this is a .js file, not an .svlete one.
 * We can get store value by $storeName in thanks to Svelt compilation, but that .js file isn't compiled by Svelte.
 */
identity.subscribe(value => {
  identityVal = value;
});
chats.subscribe(value => {
  chatsVal = value;
});
session.subscribe(value => {
  sessionVal = value;
});

var routes = [
  {
    path: '/',
    redirect: function (route, resolve, reject) {
      if ( identityVal && chatsVal && sessionVal.loggedOn ) {
        resolve('/Main/');
      } 
      if ( identityVal && chatsVal && ! sessionVal.loggedOn ) {
        resolve('/Login/');
      } 
      if ( ! identityVal || ! chatsVal ) {
        resolve('/FirstRun/');
      }
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
];

export default routes;
