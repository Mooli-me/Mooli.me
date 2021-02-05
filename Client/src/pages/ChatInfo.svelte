<script>
  import {
    f7,
    Page,
    PageContent,
    Navbar,
    NavTitle,
    NavRight,
    Card,
    Block,
    Icon,
    Button,
    Badge,
  } from 'framework7-svelte';

  import { scale } from 'svelte/transition';

  import {_} from 'svelte-i18n';

  import Avatar from '../components/Avatar.svelte';

  import QR from '../components/QR.svelte';

  import { identity, chats, session } from '../js/store.js';

  import { login, pubIdentity, updateChats } from '../js/aux.js';

  var router = f7.view.main.router;

  export var chatId;

  var copied = false;

  var chat, chatIdx, chatURL;

  function copyToClipboard(url) {
    navigator.clipboard.writeText(url).then(
      ()=>{},
      ()=>{}
    );
    copied = true;
  }

  async function logIn () {
    const loginResponse =  await login($identity);
      if ( loginResponse.ok ) {
        const updateChatsResponse = await updateChats();
        if ( updateChatsResponse.ok ) {
          $chats = updateChatsResponse.message;
          $session.loggedOn = true;
        }
      }
  }

  if ( $session.loggedOn === false ) {
    logIn();
  }
  
  $: {
    chatIdx = $chats.findIndex(
      chat => chat.id === chatId
    );
    chatURL = `${location.protocol}//${location.host}/${encodeURIComponent($chats[chatIdx].id)}`
  }



</script>

<Page name="home"  pageContent=false>

  <Navbar backLink="Back">
    <NavTitle>{$_('appNameTitle')} - {$_('ChatInfo.title')} {chatId}</NavTitle>
    <NavRight>
      {#if $session.loggedOn }
      <Avatar id={$identity} size="2em"/>
      {/if}
    </NavRight>
  </Navbar>

  <PageContent class="display-flex flex-direction-column align-content-space-around align-items-center" style="padding-top: 0px;">

    <p id="chatType">
    {#if $chats[chatIdx].type === 'p2p'}
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

    <Block class="display-flex flex-direction-col align-content-space-around align-items-center" style="flex-wrap: wrap">
      <p>{$_('ChatInfo.mooliesInTheGallery')}</p>
    {#each $chats[chatIdx].peers as peerId (peerId)}
      <div transition:scale >
        <Button large raised onClick={()=>{router.navigate(`/Chat/${encodeURIComponent(chatId)}/${encodeURIComponent(peerId)}/`)}}>
          <Avatar id="{peerId}" size=40/>
        </Button>
      </div>
    {:else}
      <p transition:scale>{$_('ChatInfo.thereIsNobody')}</p>
    {/each}
    </Block>
      
  </PageContent>

</Page>

<style>
  #chatURL {
    cursor: pointer;
    font-size: larger;
    font-weight: bolder;
  }
  #chatType {
    font-weight: bold;
  }
</style>
