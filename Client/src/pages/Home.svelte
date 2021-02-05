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

  import Avatar from '../components/Avatar.svelte';

  import { identity, chats, session, windowStorage } from '../js/store.js';

  import { ws } from '../js/webSocket.js';

  import { signOn, login, updateChats } from '../js/aux.js';


  var router = f7.view.main.router;

  var pwaInstall = null;
  var installable = false;
  var installedAway = false;
  var installedNow = false;
  var standalone = false;
  var installAction = null;
  var installButtonColor = "blue";

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
      if ( loginResponse.ok ) {
        const updateChatsResponse = await updateChats();
        if ( updateChatsResponse.ok ) {
          $chats = updateChatsResponse.message;
          $session.loggedOn = true;
        }
      }
  }

  async function install () {
    signIn();
    pwaInstall.prompt();
    pwaInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User install');
      } else {
        console.log('User dismissed the install prompt');
      }
    });

  }

  async function checkInstallationEvent() {
    installedAway = localStorage.getItem('installedAway') === null ? false : localStorage.getItem('installedAway');
  }

  function setUpdateHandlers () {
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

  window.addEventListener('appinstalled', async (ev) => {
    installedNow = true;
    installedAway = true;
    localStorage.setItem('installedAway',true)
    checkInstallationEvent();
  });

  window.addEventListener('DOMContentLoaded', 
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
  );

  window.addEventListener('beforeinstallprompt', async (ev) => {
    ev.preventDefault();
    pwaInstall = ev;
    installable = true;
  });

  window.addEventListener('load',
    async (ev) => {
      checkInstallationEvent();
      if ( !$session.guest ) {
        logIn();
      }
    }
  )

  $: {
    if (installable) {
      installAction = install;
      installButtonColor = 'blue';
    } else {
      installAction = null;
      installButtonColor = 'gray';
    }
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
    <Block>
      {#each $chats as chat, idx (chat.id)}
      <div transition:fly>
        <Button large raised fill onClick={()=>{router.navigate(`/ChatInfo/${encodeURIComponent(chat.id)}/`)}}>
            {chat.id}
          {#if chat.peers.length}
          <Badge color="black">
            {chat.peers.length}
          </Badge>
          {/if}
        </Button>
      </div>
      {:else}
      <p>Esperando la lista de chats...</p>
      {/each}
    </Block>
    {/if}

    {#if $session.guest }
    <img id="logo" alt="Mooli.me logo" src="/static/logo.png"/>
    <Card class="topic-card display-flex flex-direction-column align-content-space-around align-items-center">
      <span slot="content">
        <p>Con Mooli podrás abrir un canal de comunicación con otras personas sin necesidad de intercambiar datos personales.</p>
        <p>Si tu navegador lo permite, podrás instalar Mooli como una app y conservar tus chats.</p>
        <p>En cualquier caso, también puedes crear un chat para uso puntual.</p>
      </span>
      <span slot="footer">
        {#if !installable}<p>Tu navegador no es compatible con PWA. No puedes instalar Mooli.</p>{/if}
        <Button large color="{installButtonColor}" onClick={installAction}>
        {#if installable}
          Instalar ahora
        {:else}
          Navegador no compatible
        {/if}
        </Button>
        <Button large onClick={signIn}>
          Crear un chat efímero
        </Button>
      </span>
    </Card>
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
