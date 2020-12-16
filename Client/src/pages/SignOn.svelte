<script>
  import {
    f7,
    Page,
    Navbar,
    NavTitle,
    Block,
    Preloader,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { identity, chats, session } from '../js/store.js';

  import {sha512, newIdentity} from '../js/aux.js';

  import { ws } from '../js/webSocket.js';

  import Avatar from '../components/Avatar.svelte';

  var router = f7.view.main.router;

  var userPassword = '';
  var newId = '';
  var working = false;
  var p2p = [];
  var m2m = [];

  async function createNewIdentity () {
    newId = await newIdentity();
  }

  function login (hash) {
    var request = {
      msgType: 'login',
      nameHash: hash,
    }
    return ws.sendObj(request);
  }

  async function signOn () {
    working = true;
    var nameHash = await sha512(`${newId}:${userPassword}`)
    const request = {
      msgType: 'signon',
      nameHash,
    };
    const signupResponse = await ws.sendObj(request);
    const loginResponse = await login(nameHash);
    if ( signupResponse.ok && loginResponse.ok ) {
      $identity = newId;
      console.log(signupResponse)
      $chats = signupResponse.message.chats;
      working = false;
      router.navigate('/Main/');
    } else {
      working = false;
      alert($_('SignOn.somethingWrong'));
    }
  }

  createNewIdentity();

</script>
  
  <Page name="createIdentity" class="display-flex justify-content-center" style="height: 100vh;">
      <Navbar>
          <NavTitle>{$_('appNameTitle')} - {$_('SignOn.createIdentity')}</NavTitle>
      </Navbar>

      {#if ! working }
      <Block>
        {#await sha512(`${newId}:${userPassword}`) }
        <Avatar id=''/>
        {:then hash }
         <Avatar id={hash}/>
        {/await}
      </Block>
      <Block>
          <input
          placeholder="{$_('SignOn.passwordPlaceholder')}"
          type="password"
          bind:value={userPassword}
          />
          <p>{$_('SignOn.youCanOmitPass')}</p>
      </Block>
      <Block>
        <button on:click={signOn}>{$_('SignOn.newIdButton')}</button>
      </Block>
      {/if}

      {#if working }
      <Block  class="display-flex align-items-center" style="height: 80%;">
          <Preloader size={100}/>
      </Block>
      {/if}

  </Page>
  
  <style>
  </style>