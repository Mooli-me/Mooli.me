<script>
  import {
    f7,
    Page,
    Navbar,
    NavTitle,
    Block,
    Fab,
    Icon,
    FabButtons,
    FabButton,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { identity, chats, session } from '../js/store.js';

  import { ws } from '../js/webSocket.js';

  import ChatList from '../components/ChatList.svelte';

  var router = f7.view.main.router;

  $: {
    if ( ! $session.loggedOn ) {
      router.navigate('/Login/');
    }
  }

  async function login () {
    var request = {
      msgType: 'login',
      nameHash: await sha512(`${$identity}:${password}`),
    }
    const response = await ws.sendObj(request);
    if ( response.ok ) {
      $session.loggedOn = true;
      router.navigate('/Main/');
    } else {

    }
  }

  async function updateChats (chat=null, from=null) {
    const request = {
      msgType: 'get',
      chat: chat,
      fromTimestamp: from,
    };
    const response = await ws.sendObj(request);

    if ( response.ok ) {
      $chats = response.message;
    } else {
      console.error(response)
    }
  }
  updateChats();
  

</script>

<Page name="home" class="display-flex justify-content-center" style="height: 100vh;">
    <Navbar>
        <NavTitle>{$_('appNameTitle')} - {$_('Main.yourGalleries')}</NavTitle>
    </Navbar>

    <Block>
      <ChatList chats={$chats} />
    </Block>

    <Fab position="right-bottom">
      <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
      <Icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></Icon>
      <FabButtons position="top">
        <FabButton label="Action 1">1</FabButton>
        <FabButton label="Action 2">2</FabButton>
      </FabButtons>
    </Fab>

</Page>

<style>
</style>