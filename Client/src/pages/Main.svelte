<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Block,
    Preloader,
    List,
    ListInput,
  } from 'framework7-svelte';
  import {_} from 'svelte-i18n';
  import { identity, chats } from '../js/store.js';
  import { WS } from '../js/webSocket.js';

  var socketURL;
  if (window.location.hostname === "localhost") {
    socketURL = 'ws://localhost:3000/';
  } else {
    socketURL = `wss://${window.location.hostname}/`;
  }

  const ws = new WS(socketURL);

  var userPassword;

  async function newIdentity () {
    return  crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(crypto.getRandomValues(new Uint32Array(10)))).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash))));
  }

  async function signOn () {
    $identity = await newIdentity();
    const request = {
      msgType: 'signon',
      nameHash: await crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${newIdentity}:${userPassword}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash)))),
    };
    //const response = await fetch()
  }

</script>

<Page name="home" class="display-flex justify-content-center" style="height: 100vh;">
    <Navbar>
        <NavTitle>IndySMS</NavTitle>
    </Navbar>
    {#if $identity === null }
    <Block>
      <List>
        <ListInput
        outline
        label={$_('newAccountInsertPassPlaceholder')}
        floatingLabel
        type="text"
        clearButton
        bind:value={userPassword}
        />
        <p>{$_('newAccountYouCanOmitPass')}</p>
      </List>
      <button on:click={signOn}>{$_('newAccountButton')}</button>
    </Block>
    {:else}
    <Block  class="display-flex align-items-center" style="height: 80%;">
        <Preloader size={100}/>
    </Block>
    {/if}
</Page>

<style>

</style>