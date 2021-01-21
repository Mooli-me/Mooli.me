<App params={ f7params } themeDark>

  <!-- Your main view, should have "view-main" class -->
  <View main class="safe-areas" url="/" />

</App>
<script>
  /**
   * svelte-i18n
  */
  import {dictionary,locale} from 'svelte-i18n';
  import {translations} from '../js/translations.js';
  import {getBrowserLang} from '../js/getBrowserLang.js';
  dictionary.set(translations);
  locale.set(getBrowserLang());
  /***/
  
  import { onMount } from 'svelte';

  import {
    f7,
    f7ready,
    App,
    View,
  } from 'framework7-svelte';

  import routes from '../js/routes';

  // Framework7 Parameters
  let f7params = {
    name: 'Mooli.me', // App name
    theme: 'auto', // Automatic theme detection



    // App routes
    routes: routes,
    // Register service worker
    serviceWorker: {
      path: '/service-worker.js',
    },
    // For keep url in browsers
    view: {
      pushState: true,
      pushStateRoot: window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://mooli.me',
      pushStateSeparator: '',
      //browserHistory: true,
      //browserHistoryRoot: window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://mooli.me',
      //browserHistorySeparator: '',
    }
  };

  onMount(() => {
    f7ready(() => {

      // Call F7 APIs here
    });
  })

</script>