
import Main from '../pages/Main.svelte';
import FirsRun from '../pages/FirstRun.svelte';

import { identity, chats } from '../js/store.js';
var identityVal, chatsVal;
identity.subscribe(value => {
  identityVal = value;
});
chats.subscribe(value => {
  chatsVal = value;
});

var routes = [
  {
    path: '/',
    redirect: function (route, resolve, reject) {
      if ( identityVal || chatsVal ) {
        resolve('/Main/');
      } else {
        resolve('/FirstRun/');
      }
    }
  },
  {
    path: '/FirstRun/',
    component: FirsRun,
  },
  {
    path: '/Main/',
    component: Main,
  },
];

export default routes;
