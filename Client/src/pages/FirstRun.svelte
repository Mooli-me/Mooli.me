<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Card,
    List,
    ListInput,
    Button,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  var chatCode;

</script>

<Page name="home"  class="display-flex justify-content-center" style="height: 100vh;">

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('FirstRun.wellCome')}</NavTitle>
  </Navbar>

  <img id="logo" alt="Mooli.me logo" src="/static/logo.png"/>

  <Card class="display-flex justify-content-center">
    <p>Aquí irán los contenidos de introducción...</p>
  </Card>

</Page>

<style>
  img#logo {  
    width: 80vw;
    max-width: 200px;
  }
</style>
