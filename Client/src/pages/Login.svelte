<script>
  import {
    f7,
    Page,
    Button,
    Block,
    Navbar,
    NavTitle,
    List,
    ListInput,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { sha512 } from '../js/aux.js';

  import { identity, session } from '../js/store.js';

  import Avatar from '../components/Avatar.svelte';

  import { ws } from '../js/webSocket.js';

  let router = f7.view.main.router;
  let password = '';
  let username = '';
  let newAccount = false;
  let error;

  async function login () {
    const nameHash = await sha512(`${username}:${password}`);
    let response;
    var request = {
      msgType: 'login',
      nameHash,
    }
    response = await ws.sendObj(request);
    if ( response.ok ) {
      $session.loggedOn = true;
      $session.pubIdentity = request.nameHash;
      $session.guest = false;
      router.navigate('/Home/');
    } else {
      if (response.message === "Inexistent nameHash") {
        newAccount = true;
      }
    }
  }

  async function signUp () {
    const nameHash = await sha512(`${username}:${password}`);
    const request = {
      msgType: 'signon',
      nameHash,
    };
    const response = await ws.sendObj(request);
    if (response.ok) {
      login()
    } else {
      error = "No se ha podido crear la cuenta de usuario";
    }
  }

  function clean () {
    username = '';
    password = '';
    newAccount = '';
  }

</script>

<Page name="Login">
  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('Login.title')}</NavTitle>
</Navbar>

<div class="card">

    <div id="avatar">
      {#await sha512(`${username}:${password}`) then hash }
      <Avatar id={hash}/>
      {/await}
      <p>Este avatar representa tu identidad.</p>
    </div>

    <input
    placeholder={$_('Login.usernamePlaceholder')}
    type="text"
    bind:value = {username}
    />
    <input
    placeholder={$_('Login.passwordPlaceholder')}
    type="password"
    bind:value = {password}
    />
    {#if newAccount}
    <p>Este nombre de usuario y contraseñas nunca se han usado.</p>
    <Button large round fill on:click="{signUp}">
      {$_('Login.signUpButton')}
    </Button>
    <Button large round fill on:click="{clean}">
      {$_('Login.clearButton')}
    </Button>
    {:else}
    <Button large round fill on:click="{login}">
      {$_('Login.enterButton')}
    </Button>
    {/if}
    {#if error}
    <p>{error}</p>
    {/if}
  </div>

</Page>

<style>
  div.card {
      display: flex;
      height: 80vh;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
  }

  input {
      background-color: white;
      color: black;
      margin: 0.5em;
      padding: 1em;
      font-size: large;
      text-align: center;
      width: 80%;
      flex-grow: 0;
  }
</style>