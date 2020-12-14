<script>
  import {
    f7,
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

  import { identity, chats, session } from '../js/store.js';

  import {sha512, newIdentity} from '../js/aux.js';

  import { ws } from '../js/webSocket.js';

  import Avatar from '../components/Avatar.svelte';
  import ChatList from '../components/ChatList.svelte';

  var router = f7.view.main.router;

  var userPassword = '';
  var raisedError = false;
  var working = false;

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
      router.navigate('/')
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
        <input
        placeholder="{$_('newAccountInsertPassPlaceholder')}"
        type="password"
        bind:value={userPassword}
        />
        <p>{$_('newAccountYouCanOmitPass')}</p>
    </Block>
    <Block>
      <button on:click={signOn}>{$_('newAccountButton')}</button>
    </Block>
    {/if}
    {#if  $identity === null && working }
    <Block  class="display-flex align-items-center" style="height: 80%;">
        <Preloader size={100}/>
    </Block>
    {/if}
    {#if  $identity !== null && ! working && $session.loggedOn}
    <Block>
      <Avatar id={$identity}/>
      Chats privados
      <ChatList chats={$chats.p2pChats} />
      Chats de grupo
      <ChatList chats={$chats.m2mChats} />
    </Block>
    <Fab position="right-bottom">
      <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
      <Icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></Icon>
      <FabButtons position="top">
        <FabButton label="Action 1">1</FabButton>
        <FabButton label="Action 2">2</FabButton>
      </FabButtons>
    </Fab>
    {/if}
</Page>

<style>
</style>