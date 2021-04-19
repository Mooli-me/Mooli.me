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

  import { identity, chats, session, names } from '../js/store.js';

  import { ws } from '../js/webSocket.js';

  import { signOn, login, updateChats } from '../js/aux.js';

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

  /*async function install () {
    //signIn();
    pwaInstall.prompt();
    pwaInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User install');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  }*/

  /*async function checkInstallationEvent() {
    installedAway = localStorage.getItem('installedAway') === null ? false : localStorage.getItem('installedAway');
  }*/

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

  /*window.addEventListener('appinstalled', async (ev) => {
    installedNow = true;
    installedAway = true;
    localStorage.setItem('installedAway',true)
    checkInstallationEvent();
  });*/

  /*window.addEventListener('DOMContentLoaded', 
    async (ev) => {
      if (navigator.standalone) {
        // displayMode = 'standalone-ios';
        standalone = true;
      }
      if (window.matchMedia('(display-mode: standalone)').matches) {
        //displayMode = 'standalone';
        standalone = true;
      }
    }
  );*/

  /*window.addEventListener('beforeinstallprompt', async (ev) => {
    ev.preventDefault();
    pwaInstall = ev;
    installable = true;
  });*/

  //window.addEventListener('load', update);

  $: {
    if ($session.loggedOn) update();
  }

  $: {
    let ownGalleries = [];
    let guestGalleries = [];
    if ($session.loggedOn) $chats.forEach(
      chat => {
        if (chat.owner === $identity) {
          ownGalleries.push(chat);
        } else {
          guestGalleries.push(chat);
        }
      }
    );
    tabs = [
      {title: "Chats", contents: guestGalleries},
      {title: "Mis galerías", contents: ownGalleries},
    ];
  }

  setUpdateHandlers();

</script>

<Page name="home"  pageContent=false>

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('Home.title')}</NavTitle>
    <NavRight>
      {#if $session.loggedOn }
      <Avatar id={$identity} size="2em"/>
      {/if}
    </NavRight>
  </Navbar>

  <PageContent class="display-flex flex-direction-column align-content-space-around align-items-center" style="padding-top: 0px;">
  
    {#if $session.loggedOn }
    <TabbedSections sections="{tabs}" childComponent="{ChatIcon}" size="4em" bgColor="pink" badgeColor="indigo" on:click="{chatClickHandler}"/>
    {/if}

    {#if $session.guest }
    <img id="logo" alt="Mooli.me logo" src="/static/icons/logo.svg"/>
    {/if}

  </PageContent>

</Page>

<style>
  img#logo {  
    width: 80vw;
    max-width: 200px;
  }
  :global(.topic-card) {
    width: 30em;
    max-width: 80vw;
  }
  :global(.avatar-icon) {
    max-height: 2em;
  }
</style>
