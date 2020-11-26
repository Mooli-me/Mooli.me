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

  async function newIdentity () {
    return  crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(crypto.getRandomValues(new Uint32Array(10)))).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash))));
  }

  async function signOn () {
    working = true;
    const newId = await newIdentity();
    ws.nameSeed = newId;
    const request = {
      msgType: 'signon',
      nameHash: await crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${newIdentity}:${userPassword}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash)))),
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
        <NavTitle>IndySMS</NavTitle>
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