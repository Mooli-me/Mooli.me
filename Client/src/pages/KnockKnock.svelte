<script>
  import {
    f7,
    Page,
    PageContent,
    Navbar,
    NavLeft,
    NavTitle,
    Link,
    Preloader,
    Icon,
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

  async function requestChatAccess (chat) {
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
            const chat = $chats.find(
              (chat) => chat.id === chatCode
            )
            /*if ( chat.owner === $identity ){
              router.navigate(`/ChatInfo/${encodeURIComponent(chatCode)}/`);
            } else {
              router.navigate(`/Chat/${encodeURIComponent(chatCode)}`);
            }*/
            router.navigate(`/Chat/${encodeURIComponent(chatCode)}/null/`);
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
      }
    } else {
      serverError = chatAccessResponse.message;
      console.error(chatAccessResponse)
    }
  }

  /*
  $: {
      $session.updating = ! ( $session.loggedOn && accessRequested  && $chats ) && ! serverError && ! unknownChat;
    if ( $identity && ! accessRequested ) {
      accessRequested = true;
      requestChatAccess($identity,chatCode);
    }
    if ( chatsUpdated ) {
      router.navigate(`/Chat/${encodeURIComponent(chatCode)}/null/`);
    }
  }
*/

  $: if ( $session.loggedOn ) {
    requestChatAccess(chatCode)
  };
  console.log('*************************************************************')

</script>

<Page name="knockknock" pageContent=false>

  <Navbar>
    <NavLeft>
      <Link href='/'>
        <Icon icon="icon-back"/>
      </Link>
    </NavLeft>
    <NavTitle>{$_('appNameTitle')} - {$_('KnockKnock.enteringTo')} {chatCode} </NavTitle>
  </Navbar>

  <PageContent class="display-flex flex-direction-column justify-content-center align-content-space-around align-items-center">

  {#if unknownChat}
    <p>{$_('KnockKnock.unknownChat')} {chatCode}</p>
  {:else}
    <img id="logo" alt="Mooli.me logo" src="/static/icons/logo.svg"/>
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