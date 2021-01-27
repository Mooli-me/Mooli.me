<script>
  import {
    f7,
    Page,
    PageContent,
    Navbar,
    NavTitle,
    Preloader,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { session, chats, identity } from '../js/store.js';

  import { ws } from '../js/webSocket.js';

  import { pubIdentity, signOn, login, updateChats } from '../js/aux.js';

  export var chatCode;

  var router = f7.view.main.router;

  var accessRequested = false;
  var chatsUpdated = false;
  var unknownChat = false;
  var serverError =  false;

  async function guestLogin (id) {
    /*$session.pubIdentity = await pubIdentity(id);
    const signOnResponse = await signOn($session.pubIdentity);
    const loginResponse = await login($session.pubIdentity);
    */
    const signOnResponse = await signOn($identity);
    const loginResponse = await login($identity);
    const resultOk = signOnResponse.ok && loginResponse.ok
    if ( resultOk ) {
      $session.loggedOn = true;
    }
    return resultOk
  }

  async function requestChatAccess (id,chat) {
    if ( ! $session.loggedOn ) {
      const loginOk = await guestLogin(id)
      if ( loginOk ) {
        $session.loggedOn = true;
      } else {
        alert($_('KnockKnock.loginError'));
        return
      }
    }
    const request = {
      msgType: 'chatAccess',
      chat,
    };
    const chatAccessResponse = await ws.sendObj(request);
    
    if ( chatAccessResponse.ok ) {
      switch (chatAccessResponse.message) {
        case 'await':
          console.log('Await!');
          break;
        case 'granted':
          const updateChatsResponse = await updateChats();
          if ( updateChatsResponse.ok ) {
            $chats = updateChatsResponse.message;
            chatsUpdated = true;
            router.navigate('/Chat/'+chatCode);
          } else {
            alert($_('KnockKnock.chatsUpdateError'))
          }
          break;
        case 'unknown':
          unknownChat = true;
          break;
        default:
          alert($_('KnockKnock.unknownResponse'));
          serverError = $_('KnockKnock.unknownResponse');
          break;
      }
    } else {
      serverError = chatAccessResponse.message;
      console.error(chatAccessResponse)
    }
  }

  $: {
    $session.updating = ! ( $session.loggedOn && accessRequested  && $chats ) && ! serverError && ! unknownChat;
    if ( $identity && ! accessRequested ) {
      accessRequested = true;
      requestChatAccess($identity,chatCode);
    }
    if ( chatsUpdated ) {
      router.navigate(`/Chat/${chatCode}/null/`);
    }
  }
</script>

<Page name="knockknock" pageContent=false>

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('KnockKnock.enteringTo')} {chatCode}</NavTitle>
  </Navbar>

  <PageContent class="display-flex flex-direction-column justify-content-center align-content-space-around align-items-center">

  {#if $session.updating }
    {#if ! $identity}
    <p>{$_('KnockKnock.creatingIdentity')}</p>
    {:else if ! $session.loggedOn}
    <p>{$_('KnockKnock.startingSession')}</p>
    {:else if accessRequested}
    <p>{$_('KnockKnock.requestingAccess')}</p>
    {/if}
    <Preloader size={100}/>
  {:else if serverError}
    <p>{$_('KnockKnock.serverError')}</p>
    <p>{serverError}</p>
  {:else if unknownChat}
    <p>{$_('KnockKnock.unknownChat')} {chatCode}</p>
  {:else}
    <img id="logo" alt="Mooli.me logo" src="/static/logo.png"/>
    <p>Accediendo al chat...</p>
  {/if}

  </PageContent>

</Page>

<style>
  img#logo {  
    width: 80vw;
    max-width: 200px;
  }
</style>