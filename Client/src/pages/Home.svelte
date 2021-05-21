<script>
  import {
    f7,
    Page,
    PageContent,
    Navbar,
    NavTitle,
    NavRight,
  } from 'framework7-svelte';
  
  import {_} from 'svelte-i18n';

  import ChatCodeInput from '../components/ChatCodeInput.svelte';
  import ChatsList from '../components/ChatsList.svelte';

  import { chats, session } from '../js/store.js';

  import { ws } from '../js/webSocket.js';

  import { updateChats } from '../js/aux.js';

  import AnonymousWarning from '../components/AnonymousWarning.svelte';

  const loginDelay = 3000;

  var router = f7.view.main.router;

  async function update () {
    console.log('=> Requesting chats update...');
    const updateChatsResponse = await updateChats();
    if ( updateChatsResponse.ok ) {
      $chats = updateChatsResponse.message;
      console.log('=> Chats updated.');
    }
  }

  async function setUpdateHandlers () {
    try {
      ws.addHandler(
        {
          tag: 'updates',
          function: (obj)=>{
            var chatIdx = -1;
            switch (obj.type) {
              case 'messages':
                const message = obj.doc;
                chatIdx = $chats.findIndex(
                  chat => chat.id === message.chat
                );
                if ( chatIdx !== -1 ) {
                  $chats[chatIdx].messages = [...$chats[chatIdx].messages, message];
                } else {
                  console.error('Message update for unexistent chat');
                }
                break;
              case 'chats':
                const updatedChat = obj.doc;
                chatIdx = $chats.findIndex(
                  storedChat => storedChat.id === updatedChat.id
                );
                if ( chatIdx !== -1 ) {
                  $chats[chatIdx] = updatedChat;
                } else {
                  $chats = [...$chats, updatedChat];
                }
                break;
              default:
                console.error('Unhandled update mensage:', obj);
                break;
            }
          }
        }
      );
    } catch (err) {
      console.error(err)
    }
  }

  function goToChatInfo () {
    router.navigate(`/ChatInfo/${encodeURIComponent($chats[0].id)}/`)
  }

  function accessControl (flag = false) {
    if ( flag ) {
      if ( ! $session.loggedOn ) {
        router.navigate(`/Login/${encodeURIComponent('/Home/')}/`);
      } else {
        setUpdateHandlers();
      }
    } else {
      setTimeout(()=>accessControl(true),500);
    }
  }

  accessControl();

  $: {
    if ($session.loggedOn) update();
  }


</script>

<Page name="home"  pageContent=false>

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('Home.title')}</NavTitle>
    <NavRight>
      <img class="button" src="/static/icons/qr.svg" alt="Galleries" on:click={goToChatInfo}/>
    </NavRight>
  </Navbar>

  <PageContent class="display-flex flex-direction-column justify-content-space-evenly align-content-space-around align-items-center" style="padding-top: 0px;">
  
    {#if $session.loggedOn }
      {#if ($chats.length === 1) && ($chats[0].peers.length === 0 ) }
      <img id="logo" alt="Mooli.me logo" src="/static/icons/logo.svg"/>
      {:else}
      <ChatsList/>
      {/if}
      <ChatCodeInput/>
    {:else}
      <img id="logo" alt="Mooli.me logo" src="/static/icons/logo.svg"/>
      <p>Conectando...</p>
    {/if}
    <AnonymousWarning/>
  </PageContent>

</Page>

<style>
  img#logo {  
    width: 80vw;
    max-width: 200px;
  }
</style>
