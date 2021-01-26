<script>
  import {
    f7,
    Page,
    PageContent,
    Navbar,
    NavTitle,
    Card,
    Block,
    Button,
    Badge,
  } from 'framework7-svelte';
  
  import {_} from 'svelte-i18n';

  import Avatar from '../components/Avatar.svelte';

  import { identity, chats, session, windowStorage } from '../js/store.js';

  import { signOn, login, updateChats } from '../js/aux.js';

  var router = f7.view.main.router;

  var pwaInstall = null;
  var installable = false;
  var installedAway = false;
  var installedNow = false;
  var standalone = false;

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
    console.log
  });

  window.addEventListener('load',
    async (ev) => {
      checkInstallationEvent();
      if ( !$session.guest ) {
        logIn();
      }
    }
  )

</script>

<Page name="home"  pageContent=false>

  <Navbar>
    {#if $session.loggedOn }
    <Avatar id={$identity} size="2em"/>
    {/if}
    <NavTitle>{$_('appNameTitle')} - {$_('Home.title')}</NavTitle>
  </Navbar>

  <PageContent class="display-flex flex-direction-column align-content-space-around align-items-center" style="padding-top: 0px;">

    {#if $session.loggedOn }
    <Block>
      {#each $chats as chat, idx (chat.id)}
      <Button large raised fill onClick={()=>{router.navigate(`/ChatInfo/${chat.id}/`)}}>
          {chat.id}
        {#if chat.peers.length}
        <Badge color="black">
          {chat.peers.length}
        </Badge>
        {/if}
      </Button>
      {:else}
      <p>Esperando la lista de chats...</p>
      {/each}
    </Block>
    {/if}

    {#if $session.guest }
    <img id="logo" alt="Mooli.me logo" src="/static/logo.png"/>
    <Card class="topic-card">
      <span slot="content">
        <p>Con Mooli podrás abrir un canal de comunicación con otras personas sin necesidad de intercambiar datos personales.</p>
        <p>Puedes usar Mooli como una página web o instalarla en tu teléfono u ordenador utilizando un navegador compatible.</p>
      </span>
      <span slot="footer">
        {#if installable && !installedNow}
        <Button large onClick={install}>
          Instalar ahora
        </Button>
        {:else}
        <p>Tu navegador no puede instalar aplicaciones PWA</p>
        {/if}
        <Button large onClick={signIn}>
          Usar Mooli desde la web.
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
