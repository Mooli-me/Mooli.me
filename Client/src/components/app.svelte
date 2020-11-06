<App params={ f7params } themeDark>

  <!-- Your main view, should have "view-main" class -->
  <View main class="safe-areas" url="/" />

</App>
<script>
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
    name: 'IndySMS', // App name
    theme: 'auto', // Automatic theme detection



    // App routes
    routes: routes,
    // Register service worker
    serviceWorker: {
      path: '/service-worker.js',
    },
  };

  onMount(() => {
    f7ready(() => {

      // Call F7 APIs here
    });
  })
</script>