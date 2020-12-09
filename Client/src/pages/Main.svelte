<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Block,
    Preloader,
    List,
    ListInput,
    Fab,
    Icon,
    FabButtons,
    FabButton,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { identity, chats } from '../js/store.js';

  import { WS } from '../js/webSocket.js';

  import Avatar from '../components/Avatar.svelte';
  import ChatList from '../components/ChatList.svelte';

  var socketURL;
  if (window.location.hostname === "localhost") {
    socketURL = 'ws://localhost:3000/';
  } else {
    socketURL = `wss://${window.location.hostname}/`;
  }

  const ws = WS(socketURL,$identity);

  var userPassword, raisedError, working;

  async function sha512(data) {
    const utf8 = new TextEncoder("utf-8");
    const string = utf8.encode(data);
    const hash = await crypto.subtle.digest("SHA-512",string);
    const hashArray = new Uint8Array(hash);
    const hashString = String.fromCharCode(...hashArray);
    const base64 = btoa(hashString);
    /*
    console.log(
      `string: ${string}
      hash: ${hash}
      hashArray: ${hashArray}
      hashString: ${hashString}
      base64: ${base64}
      `
    )
    */
    return base64;
  }

  async function newIdentity () {
    return sha512(crypto.getRandomValues(new Uint32Array(10)));
  }

  async function signOn () {
    working = true;
    const newId = await newIdentity();
    ws.nameSeed = newId;
    const request = {
      msgType: 'signon',
      nameHash: await sha512(`${newId}:${userPassword}`),
    };
    const response = await ws.sendObj(request);
    if (response.ok) {
      $identity = newId;
      $chats = {
        p2pChats: [],
        m2mChats: [],
      };
      working = false;
    } else {
      raisedError = true;
      working = false;
    }
  }
</script>

<Page name="home" class="display-flex justify-content-center" style="height: 100vh;">
    <Navbar>
        <NavTitle>{$_('appNameTitle')}</NavTitle>
    </Navbar>
    {#if $identity === null && ! working }
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
    {/if}
    {#if  $identity === null && working }
    <Block  class="display-flex align-items-center" style="height: 80%;">
        <Preloader size={100}/>
    </Block>
    {/if}
    {#if  $identity !== null && ! working }
    <Fab position="right-bottom">
      <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
      <Icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></Icon>
      <FabButtons position="top">
        <FabButton label="Action 1">1</FabButton>
        <FabButton label="Action 2">2</FabButton>
      </FabButtons>
    </Fab>
    <Block>
      <Avatar id={$identity}/>
      Chats privados
      <ChatList chats={$chats.p2pChats} />
      Chats de grupo
      <ChatList chats={$chats.m2mChats} />
    </Block>
    {/if}
</Page>

<style>
</style>