<script>
  import {
    f7,
    Page,
    Navbar,
    NavTitle,
    Link,
    Block,
    BlockTitle,
    Badge,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { identity, chats, session } from '../js/store.js';

  import Avatar from '../components/Avatar.svelte';

  import { ws } from '../js/webSocket.js';

  var router = f7.view.main.router;

  export var chatIdx;

  const chat = $chats[chatIdx];

  $: {
    if ( ! $session.loggedOn ) {
      router.navigate('/Login/');
    }
  }

  console.log(chat)

</script>

<Page name="Peers" class="display-flex justify-content-center" style="height: 100vh;">
    <Navbar backLink="Back">
        <NavTitle>{$_('Peers.title')} - {chat.id}</NavTitle>
    </Navbar>

    <Block>
    {#each chat.peers as item, idx }
      <Link href="/">
        <Block class='mole'>
          <BlockTitle>
            <Avatar id={item}/>
            <img class="grpType" alt={item.type} src="/static/{item.type}.png">
            {item.id}
          </BlockTitle>
        </Block>
      </Link>
    {:else}
      {$_('Peers.thereIsNotPeers')}
    {/each}
    </Block>
</Page>

<style>
  img.grpType {
      height: 4em;
      vertical-align: middle;
  }
  .mole {
    background-color: rgb(10,10,10);
  }
</style>