<script>
    import { onMount } from 'svelte';
    import {
        f7,
        f7ready,
        Navbar,
        NavTitle,
        NavRight,
        NavLeft,
        Link,
        Page,
        Messages,
        Message,
        Messagebar,
        Icon,
    } from 'framework7-svelte';

    import {_} from 'svelte-i18n';

    import Avatar from '../components/Avatar.svelte';

    import { avatar } from '../js/AvatarURI.js';

    import { identity, session, chats } from '../js/store.js';

    import { ws } from '../js/webSocket.js';

    import { login, updateChats } from '../js/aux.js';

    export var chatId;
    export var destId;

    destId = destId === 'null' ? null : destId;
    
    var router = f7.view.main.router;

    let messagebarComponent;
    let messagebarInstance;

    var attachments = [];
    let sheetVisible = false;
    let typingMessage = null;
    let messageText = '';
    let responseInProgress = false;

    var attachmentsVisible;
    var placeholder;

    var chatIdx = 0;
    var chatsUpdated = false;
    var messages = [];
    var peerId = null;
    var backURL = '/';

    /*var messagesData = [];

    var chat = {
        id: '',
        messages: [''],
        bannedIds: [],
        isPublic: false,
        owner: session.publicId,
        peerRequests: [],
        peers: [session.publicId],
        type: 'm2m',
    };*/

    function messagesData (chat) {
        return chat.type === 'm2m' ? chat.messages : chat.messages.filter(
            (msg) => {
                const chatOwner = $chats[chatIdx].owner;
                if ( $identity === chatOwner ) {
                    return msg.destination === null && msg.user === destId || msg.destination === destId && msg.user === $identity;
                } else {
                    return msg.destination === $identity || msg.user === $identity;
                }
            }
        );
    }

    function isFirstMessage(message, index) {
        const previousMessage = messagesData($chats[chatIdx])[index - 1];
        if (message.isTitle) return false;
        if (!previousMessage || previousMessage.type !== message.type || previousMessage.user !== message.user) return true;
        return false;
    }
    function isLastMessage(message, index) {
        const nextMessage = messagesData($chats[chatIdx])[index + 1];
        if (message.isTitle) return false;
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.user !== message.user) return true;
        return false;
    }
    function isTailMessage(message, index) {
        const nextMessage = messagesData($chats[chatIdx])[index + 1];
        if (message.isTitle) return false;
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.user !== message.user) return true;
        return false;
    }
    /* function deleteAttachment(image) {
        const index = attachments.indexOf(image);
        attachments.splice(index, 1);
        attachments = attachments;
    } */
    /* function handleAttachment(e) {
        const index = f7.$(e.target).parents('label.checkbox').index();
        const image = images[index];
        if (e.target.checked) {
        // Add to attachments
        attachments.unshift(image);
        } else {
        // Remove from attachments
        attachments.splice(attachments.indexOf(image), 1);
        }
        attachments = attachments;
    } */
    async function sendMessage() {
        const text = messageText.replace(/\n/g, '<br>').trim();
        const messagesToSend = [];
        /*
        attachments.forEach((attachment) => {
        messagesToSend.push({
            type: 'sent',
            image: attachment,
        });
        });
        */
        if (text.length) {
            const request = {
                msgType: 'put',
                msg: {
                    destType: $chats[chatIdx].type,
                    chat: $chats[chatIdx].id,
                    destination: destId,
                    contentType: 'string',
                    content: text,
                }
            };
            const response = await ws.sendObj(request);
        }
        else {
            return;
        }

        // Reset attachments
        attachments = [];
        // Hide sheet
        sheetVisible = false;
        // Clear
        messageText = '';
        messagebarInstance.clear();

        // Focus area
        if (text.length) messagebarInstance.focus();

        // Mock response
        if (responseInProgress) return;
        responseInProgress = true;
    }

    function messageType(message) {
        return message.user === $identity ? 'sent' : 'received' ;
    }

    /*function setUpdateHandlers () {
        try {
            ws.addHandler(
                {
                    tag: 'updates',
                    function: (obj)=>{
                        if ( obj.type === 'messages' ) {
                            $chats[chatIdx].messages = [...$chats[chatIdx].messages, obj.doc];
                        } else {
                            console.error('Unhandled update mensage:', obj);
                        }
                    }
                }
            );
        } catch (err) {
            console.error(err)
        }
    }*/

    async function getChatIdx() {
        const chatUpdateResponse = await updateChats(chatId);
        if ( chatUpdateResponse.ok ) {
            $chats = chatUpdateResponse.message;
            chatIdx = $chats.findIndex(
                chat => chat.id === chatId
            );
            chatsUpdated = true;
        }
    }

    async function logIn () {
        const loginResponse =  await login($identity);
        console.log(loginResponse)
        if ( loginResponse.ok ) {
            $session.loggedOn = true;
        } else {
            console.error(loginResponse);
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
    $: { 
        attachmentsVisible = attachments.length > 0;
        placeholder = attachments.length > 0 ? $_('Chat.commentPlaceholder') : $_('Chat.messagePlaceholder');
    }
    $: {
        if ( $session.loggedOn === false && $identity ) {
            logIn();
        }
        if ( $session.loggedOn === true &&  chatsUpdated === false ) {
            getChatIdx();
        }
        if ( chatsUpdated === true ) {
            peerId = destId ? destId : $chats[chatIdx].owner;
            backURL = $chats[chatIdx].owner === $identity ? `/ChatInfo/${chatId}/` : '/' ;
        }
    }
    $: {
        if ( chatsUpdated === true && $chats[chatIdx].messages ) {
            messages = messagesData($chats[chatIdx]);
        }
    }

    onMount(() => {
        f7ready(() => {
        messagebarInstance = messagebarComponent.instance();
        });
    });

    if ( ! ws.pushHandlers.hasOwnProperty('updates') ) setUpdateHandlers();

</script>

<Page>

    <Navbar>
        <NavLeft>
            <Link href={backURL}>
              <Icon icon="icon-back"/>
            </Link>
        </NavLeft>
        <NavTitle>{$_('appNameTitle')} - {$_('Chat.title')} {$chats[chatIdx].id}</NavTitle>
        <NavRight>
          {#if peerId}
          <Avatar id={peerId} size="2em"/>
          {/if}
        </NavRight>
    </Navbar>

    <Messagebar
        placeholder={placeholder}
        bind:this={messagebarComponent}
        attachmentsVisible={attachmentsVisible}
        sheetVisible={sheetVisible}
        value={messageText}
        onInput={(e) => messageText = e.target.value}
    >
        <!--
        <a class="link icon-only" slot="inner-start" on:click={() => sheetVisible = !sheetVisible}>
        <Icon
            ios="f7:camera_fill"
            aurora="f7:camera_fill"
            md="material:camera_alt"
        />
        </a>
        -->

        <span class="link icon-only" slot="inner-end" on:click={sendMessage}>
        <Icon
            ios="f7:arrow_up_circle_fill"
            aurora="f7:arrow_up_circle_fill"
            md="material:send"
        />
        </span>

        <!--
        <MessagebarAttachments>
        {#each attachments as image, index (index)}
            <MessagebarAttachment
            key={index}
            image={image}
            onAttachmentDelete={() => deleteAttachment(image)}
            ></MessagebarAttachment>
        {/each}
        </MessagebarAttachments>
        -->

        <!--
        <MessagebarSheet>
        {#each images as image, index (index)}
            <MessagebarSheetImage
            key={index}
            image={image}
            checked={attachments.indexOf(image) >= 0}
            onChange={handleAttachment}
            ></MessagebarSheetImage>
        {/each}
        </MessagebarSheet>
        -->

    </Messagebar>

    {#if $chats}
    <Messages>
        
        <!--
            <MessagesTitle><b>Sunday, Feb 9,</b> 12:58</MessagesTitle>
        -->

        {#each messages as message, index (message.time)}
        
        <!--
        <Message
            type={message.type}
            image={message.image}
            name={message.name}
            avatar={message.avatar}
            first={isFirstMessage(message, index)}
            last={isLastMessage(message, index)}
            tail={isTailMessage(message, index)}
            htmlText={message.text}
        />
        -->
        <Message
            type={messageType(message)}
            name={message.user}
            avatar={avatar(message.user)}
            first={isFirstMessage(message, index)}
            last={isLastMessage(message, index)}
            tail={isTailMessage(message, index)}
            htmlText={message.content}
        />
        {/each}

        {#if typingMessage}
        <Message
            type="received"
            typing={true}
            first={true}
            last={true}
            tail={true}
            header={$_('Chat.typing')}
            avatar={avatar(typingMessage.name)}
        ></Message>
        {/if}

    </Messages>
    {/if}

</Page>

<style>
    :global(div.message-avatar) {
        border-radius: 0;
    }
    :global(div.message-name) {
        display: none;
    }
</style>