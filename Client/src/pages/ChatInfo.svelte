<script>
  import {
    f7,
    Page,
    PageContent,
    Navbar,
    NavTitle,
    Card,
    Block,
    Icon,
    Button,
    Badge,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import Avatar from '../components/Avatar.svelte';

  import QR from '../components/QR.svelte';

  import { identity, chats, session } from '../js/store.js';

  import { signOn, login, updateChats } from '../js/aux.js';
import CardContent from 'framework7-svelte/components/card-content.svelte';

  var router = f7.view.main.router;

  export var chatId;

  var copied = false;

  var chatIdx = $chats.findIndex(
    chat => chat.id === chatId
  );

  var chat = $chats[chatIdx];

  var chatURL = `${location.protocol}//${location.host}/${chat.id}`

  function copyToClipboard(url) {
    navigator.clipboard.writeText(url).then(
      ()=>{},
      ()=>{}
    );
    copied = true;
  }

</script>

<Page name="home"  pageContent=false>

  <Navbar>
    {#if $session.loggedOn }
    <Avatar id={$identity} size="2em"/>
    {/if}
    <NavTitle>{$_('appNameTitle')} - {$_('ChatInfo.title')} {chatId}</NavTitle>
  </Navbar>

  <PageContent class="display-flex flex-direction-column align-content-space-around align-items-center" style="padding-top: 0px;">

    <p id="chatType">
    {#if chat.type === 'p2p'}
    {$_('ChatInfo.privateChat')}
    {:else}
    {$_('ChatInfo.groupChat')}
    {/if}
    </p>

    <p id="chatURL" on:click={()=>{copyToClipboard(chatURL)}}>
      {chatURL}
      {#if copied}
      <Icon f7="checkmark_alt_circle"/>
      {:else}
      <Icon f7="rectangle_paperclip"/>
      {/if}
    </p>

    <QR data={chatURL} size=200/>

    {#each chat.peers as peerId, idx (chat.id)}
    <Button large raised onClick={()=>{router.navigate(`/Chat/${chatId}/${encodeURIComponent(peerId)}/`)}}>
      <Avatar id="{peerId}" size=40/>
    </Button>
    {/each}
      
  </PageContent>

</Page>

<style>
  img#logo {  
    width: 80vw;
    max-width: 200px;
  }
  #chatURL {
    cursor: pointer;
    font-size: larger;
    font-weight: bolder;
  }
  #chatType {
    font-weight: bold;
  }
</style>
