<script>
  import {
    f7,
    Page,
    PageContent,
    Navbar,
    NavTitle,
    NavRight,
    NavLeft,
    Block,
    Icon,
    Link,
    Button,
  } from 'framework7-svelte';

  import { scale } from 'svelte/transition';

  import {_} from 'svelte-i18n';

  import Avatar from '../components/Avatar.svelte';

  import QR from '../components/QR.svelte';

  import { identity, chats, session, names } from '../js/store.js';

  import { login, pubIdentity, updateChats} from '../js/aux.js';

  import { ws } from '../js/webSocket.js';

  const router = f7.view.main.router;

  export var chatId;

  var copied = false;
  let updated = false

  let chat, chatIdx, chatURL;

  let name = $names[chatId] || '';

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

  async function update () {
    const updateChatsResponse = await updateChats();
    if ( updateChatsResponse.ok ) {
      $chats = updateChatsResponse.message;
      updated = true;
    }
  }

  async function setUpdateHandlers () {
    try {
      ws.addHandler(
        {
          tag: 'updates',
          function: (obj)=>{
            var chatIdx = -1;
            switch (obj.type) {
              case 'messages':
                const message = obj.doc;
                chatIdx = $chats.findIndex(
                  chat => chat.id === message.chat
                );
                if ( chatIdx !== -1 ) {
                  $chats[chatIdx].messages = [...$chats[chatIdx].messages, message];
                } else {
                  console.error('Message update for unexistent chat');
                }
                break;
              case 'chats':
                const updatedChat = obj.doc;
                chatIdx = $chats.findIndex(
                  storedChat => storedChat.id === updatedChat.id
                );
                if ( chatIdx !== -1 ) {
                  $chats[chatIdx] = updatedChat;
                } else {
                  $chats = [...$chats, updatedChat];
                }
                break;
              default:
                console.error('Unhandled update mensage:', obj);
                break;
            }
          }
        }
      );
    } catch (err) {
      console.error(err)
    }
  }

  function avatarClickHandler (id) {
    router.navigate(`/CustomName/${encodeURIComponent(id)}/`);
  }

  function accessControl (flag = false) {
    if ( flag ) {
      if ( ! $session.loggedOn ) {
        router.navigate(`/Login/${encodeURIComponent(`/ChatInfo/${chatId}/`)}/`);
      } else {
        setUpdateHandlers();
      }
    } else {
      setTimeout(()=>accessControl(true),500);
    }
  }

  accessControl()
  
  if ( ! ws.pushHandlers.hasOwnProperty('updates') ) setUpdateHandlers();

  $: if ( $session.loggedOn ) update();
  
  $: if ( $session.loggedOn && updated ) {
    chatIdx = $chats.findIndex(
      chat => chat.id === chatId
    );
    chatURL = `${location.protocol}//${location.host}/${encodeURIComponent($chats[chatIdx].id)}`
  }

  $: if ( $session.loggedOn && updated ) {
    $names[chatId] = name;
  }

</script>

<Page name="home"  pageContent=false>

  <Navbar>
    <NavLeft>
      <Link href='/Home/'>
        <Icon icon="icon-back"/>
      </Link>
    </NavLeft>
    <NavTitle>
      {$_('appNameTitle')} - <span on:click={()=>avatarClickHandler(chatId)}> {$names[chatId] || chatId} <img id="editNameIcon" alt="Cambiar nombre" src="/static/icons/lapiz.svg"/></span>
    </NavTitle>
    <NavRight>
      {#if $session.loggedOn }
      <Avatar id={$identity} size="2em"/>
      {/if}
    </NavRight>
  </Navbar>

  <PageContent class="display-flex flex-direction-column align-content-space-around align-items-center" style="padding-top: 0px;">
    {#if $session.loggedOn && updated }
    <p id="code">{$chats[chatIdx].id}</p>
    <p id="chatType">
      {#if $chats[chatIdx].type === 'p2p'}
      {$_('ChatInfo.privateChat')}
      {:else}
      {$_('ChatInfo.groupChat')}
      {/if}
    </p>
    
    <div id='visual' on:click={()=>{copyToClipboard(chatURL)}}>
      <QR data={chatURL} size=100/>
    </div>
    <p id="chatURL" on:click={()=>{copyToClipboard(chatURL)}}>
      {chatURL}
      {#if copied}
      <Icon f7="checkmark_alt_circle"/>
      {:else}
      <Icon f7="rectangle_paperclip"/>
      {/if}
    </p>



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
    {/if}
  </PageContent>

</Page>

<style>
  #chatURL {
    cursor: pointer;
    font-size: larger;
    font-weight: bolder;
    margin: 0;
  }
  #chatType {
    font-weight: bold;
  }
  img#editNameIcon {
      height: 1em;
      vertical-align: text-bottom
  }
  div#visual {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:center;
    width: 100%;
  }
  p#code {
    font-size: xx-large;
  }
</style>
