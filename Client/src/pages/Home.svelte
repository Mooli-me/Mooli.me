<script>
  import {
    f7,
    Page,
    PageContent,
    Navbar,
    NavTitle,
    NavRight,
    Card,
    Block,
    Button,
    Badge,
  } from 'framework7-svelte';

  import { fly } from 'svelte/transition';
  
  import {_} from 'svelte-i18n';

  import TabbedSections from '../components/TabbedSections.svelte';
  import ChatIcon from '../components/ChatIcon.svelte';
  import Avatar from '../components/Avatar.svelte';
  import ChatCodeInput from '../components/ChatCodeInput.svelte';
  import ChatsList from '../components/ChatsList.svelte';

  import { identity, chats, session, names } from '../js/store.js';

  import { ws } from '../js/webSocket.js';

  import { signOn, login, updateChats } from '../js/aux.js';

  import AnonymousWarning from '../components/AnonymousWarning.svelte';

  const loginDelay = 3000;

  var router = f7.view.main.router;

  var pwaInstall = null;
  var tabs = [];

  async function signIn () {
    const id = sessionStorage.getItem('identity');
    identity.subscribe(
      (identity)=>{
        const identityJSON = JSON.stringify(identity);
        localStorage.setItem('identity', identityJSON);
      }
    );
    chats.subscribe(
      (chats)=>{
        const chatsJSON = JSON.stringify(chats);
        localStorage.setItem('chats', chatsJSON);
      }
    );
    names.subscribe(
      (names)=>{
        const namesJSON = JSON.stringify(names);
        localStorage.setItem('names', namesJSON);
      }
    );
    const signOnResponse = await signOn($identity);
    if ( signOnResponse.ok ) {
      $session.guest = false;
      logIn();
    } else {
      alert('Error en signin')
    }
  }

  async function logIn () {
    const loginResponse =  await login($identity);
    console.log('Login result:',loginResponse);
    if ( loginResponse.ok ) {
      const updateChatsResponse = await updateChats();
      if ( updateChatsResponse.ok ) {
        $chats = updateChatsResponse.message;
        $session.loggedOn = true;
      }
    } else {
      setTimeout(logIn,loginDelay);
    }
  }

  async function update () {
    const updateChatsResponse = await updateChats();
    if ( updateChatsResponse.ok ) {
      $chats = updateChatsResponse.message;
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

  function chatClickHandler (ev) {
    var chat = ev.detail;
    if (chat.owner === $identity) {
      router.navigate(`/ChatInfo/${encodeURIComponent(chat.id)}/`)
    } else {
      router.navigate(`/Chat/${encodeURIComponent(chat.id)}/null/`)
    }
  }

  $: {
    if ($session.loggedOn) update();
  }

  $: {
    let ownGalleries = [];
    let questChats = [];
    if ($session.loggedOn) $chats.forEach(
      chat => {
        if (chat.owner === $identity) {
          ownGalleries.push(chat);
        } else {
          questChats.push(chat);
        }
      }
    );
    tabs = [
      {title: "Chats", contents: questChats},
      {title: "Tus galerías", contents: ownGalleries},
    ];
  }

  setUpdateHandlers();

</script>

<Page name="home"  pageContent=false>

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('Home.title')}</NavTitle>
    <NavRight>
      Menú?
    </NavRight>
  </Navbar>

  <PageContent class="display-flex flex-direction-column justify-content-space-evenly align-content-space-around align-items-center" style="padding-top: 0px;">
  
    {#if $session.loggedOn }
      {#if $chats.length === 1}
      <img id="logo" alt="Mooli.me logo" src="/static/icons/logo.svg"/>
      {:else}
      <!--
      <TabbedSections sections="{tabs}" childComponent="{ChatIcon}" size="4em" bgColor="pink" badgeColor="indigo" on:click="{chatClickHandler}"/>
      -->
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
  button {
    padding: 2em;
    max-width: 80%;
  }
</style>
