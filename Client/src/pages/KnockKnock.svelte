<script>
  import {
    f7,
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

  import { pubIdentity, signOn, login, updateChats } from '../js/aux.js';

  export var chatCode;

  var router = f7.view.main.router;

  var accessRequested = false;
  var chatsUpdated = false;

  async function guestLogin (id) {
    $session.pubIdentity = await pubIdentity(id);
    const signOnResponse = await signOn($session.pubIdentity);
    const loginResponse = await login($session.pubIdentity);
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
        default:
          alert($_('KnockKnock.unknownResponse'));
          break;
      }
    } else {
      console.error(chatAccessResponse)
    }
  }

  $: {
    $session.updating = ! ( $session.loggedOn && accessRequested  && $chats );
    if ( $identity && ! accessRequested ) {
      accessRequested = true;
      requestChatAccess($identity,chatCode);
    }
    if ( chatsUpdated ) {
      console.log('-------------->')
      router.navigate(`/Chat/${chatCode}/`);
    }
  }
</script>

<Page name="home" pageContent=false>

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('KnockKnock.enteringTo')} {chatCode}</NavTitle>
  </Navbar>

  <PageContent class="display-flex justify-content-center align-content-space-around align-items-center	flex-direction-column">

  {#if $session.updating }
    {#if ! $identity}
    <p>Creando identidad...</p>
    {/if}
    {#if ! $session.loggedOn}
    <p>Iniciando sesión...</p>
    {/if}
    {#if accessRequested}
    <p>Solicitando acceso... </p>
    {/if}
    <Preloader size={100}/>
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