<script>
  import {
    f7,
    Page,
    Navbar,
    NavTitle,
    Fab,
    Icon,
    FabButtons,
    FabButton,
    Link,
    Block,
    BlockTitle,
    Badge,
    Preloader,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { identity, chats, session } from '../js/store.js';

  import { ws } from '../js/webSocket.js';

  var router = f7.view.main.router;

  $: {
    if ( ! $session.loggedOn ) {
      router.navigate('/Login/');
    }
    if ( $ws ) console.log('WS!');
  }

  async function updateChats (chat=null, from=null) {
    $session.updating = true;
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
    $session.updating = false;
  }
  updateChats();

</script>

<Page name="home" class="display-flex justify-content-center" style="height: 100vh;">
    <Navbar>
        <NavTitle>{$_('appNameTitle')} - {$_('Main.yourGalleries')}</NavTitle>
    </Navbar>

    <Block>
    {#if $session.updating }
      <Preloader size={100}/>
    {:else}
    <br><Link href='/qzJjO'>qzJjO</Link><br><Link href='/zzzzz'>zzzzz</Link><br><Link href='/aaaaa'>aaaaa</Link><br>
    {#each $chats as item, idx }
      {#if item.type === 'p2p'}
        <Link href="/Peers/{idx}/">
          <Block class="gallery">
            <BlockTitle>
              <img class="grpType" alt={item.type} src="/static/{item.type}.png">
              {item.id}
            </BlockTitle>
          {#if item.peerRequests.length}
            Requests: <Badge>{item.peerRequests.length}</Badge>
          {/if}
          </Block>
        </Link>
      {/if}
      {#if item.type === 'm2m'}
        <Link href="/Chat/{idx}/">
          <Block  class="gallery">
            <img class="grpType" alt={item.type} src="/static/{item.type}.png">
            {item.id}
          {#if item.messages.length}
            <Badge>{item.messages.length}</Badge>
          {/if}
          </Block>
        </Link>
      {/if}
      {:else}
        {$_('Components.ChatList.mainThereIsNotChatsToShow')}
      {/each}
    {/if}
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
  img.grpType {
      height: 4em;
      vertical-align: middle;
  }
  :global(.gallery) {
    background-color: rgb(30,30,30);
    border-radius: 20px;
  }
</style>