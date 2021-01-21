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

  import { session, chats, identity } from '../js/store.js';

  import { ws } from '../js/webSocket.js';

  import { pubIdentity, signOn, login } from '../js/aux.js';

  export var chatCode;

  var accessRequestResponse = {};

  $: {
    $session.updating = $session.loggedOn && accessRequestResponse.ok;
    console.log($session.loggedOn, accessRequestResponse.ok, $session.loggedOn && accessRequestResponse.ok)
  }

  async function guestLogin () {
    $session.pubIdentity = await pubIdentity($identity);
    const signOnResponse = await signOn($session.pubIdentity);
    const loginResponse = await login($session.pubIdentity);
    const resultOk = signOnResponse.ok && loginResponse.ok
    if ( resultOk ) {
      $session.loggedOn = true;
    }
    return resultOk
  }

  async function requestChatAccess (chat=null) {
    if ( ! $session.loggedOn ) {
      const loginOk = await guestLogin()
      if ( loginOk ) {
        $session.loggedOn = true;
      } else {
        console.error('Login error');
      }
    }
    $session.updating = true;
    const request = {
      msgType: 'chatAccess',
      chat,
    };
    const response = await ws.sendObj(request);
    
    if ( response.ok ) {
      $chats = response.message;
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
