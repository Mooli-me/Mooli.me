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

</script>

<Page name="home" class="display-flex justify-content-center" style="height: 100vh;">
    <Navbar>
        <NavTitle>{$_('appNameTitle')} - {$_('Main.yourGalleries')}</NavTitle>
    </Navbar>

    <Block>
      {$_('Main.yourDuoGalleries')}
      <ChatList chats={$chats.p2p} />
      {$_('Main.yourCrowdGalleries')}
      <ChatList chats={$chats.m2m} />
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