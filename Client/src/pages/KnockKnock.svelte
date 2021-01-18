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

  import { session } from '../js/store.js';

  export var chatCode;

  $session.updating = true;

  import { ws } from '../js/webSocket.js';

  async function requestChatAccess (chat=null) {
    $session.updating = true;
    const request = {
      msgType: 'chatAccess',
      chat,
    };
    const response = await ws.sendObj(request);
    
    if ( response.ok ) {
      //$chats = response.message;
    } else {
      console.error(response)
    }
    $session.updating = false;
  }
  requestChatAccess(chatCode);
</script>

<Page name="home" pageContent=false>

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('KnockKnock.enteringTo')} {chatCode}</NavTitle>
  </Navbar>

  <PageContent class="display-flex justify-content-center">

  {#if $session.updating }
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
