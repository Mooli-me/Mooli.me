<script>
  import {
    Page,
    PageContent,
    Navbar,
    NavTitle,
    Button,
    Preloader,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  export var chatCode;

  var working = true;

  /*
  Exist -> Error
  Woned || Member -> `/Chat/${chatCode}/`
  Else -> Input presentation button 'Request access'
  */

</script>

<Page name="home" pageContent=false>

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('KnockKnock.enteringTo')} {chatCode}</NavTitle>
  </Navbar>

  <PageContent class="display-flex justify-content-center">

    {#if working }
    <Preloader size={100}/>
    {:else}
    <Button large round fill href="/Chat/{chatCode}/">
      {$_('FirstRun.enterChat')}
    </Button>
    <img id="logo" alt="Mooli.me logo" src="/static/logo.png"/>
    {/if}

  </PageContent>

</Page>

<style>
  img#logo {  
    width: 80vw;
    max-width: 200px;
  }
</style>
