<script>
    import { onMount } from 'svelte';
    import {
        f7,
        f7ready,
        Navbar,
        NavTitle,
        Page,
        Messages,
        Message,
        Messagebar,
        Icon,
    } from 'framework7-svelte';

    import {_} from 'svelte-i18n';

    import { avatar } from '../js/AvatarURI.js';

    import { identity, session, chats } from '../js/store.js';

    import { ws } from '../js/webSocket.js';

    import { updateChats } from '../js/aux.js';

    export var chatId;
    export var destination = null;
    
    var router = f7.view.main.router;

    let messagebarComponent;
    let messagebarInstance;

    var attachments = [];
    let sheetVisible = false;
    let typingMessage = null;
    let messageText = '';

    var attachmentsVisible;
    var placeholder;

    var chat = {
        id: '',
        messages: [''],
        bannedIds: [],
        isPublic: false,
        owner: session.publicId,
        peerRequests: [],
        peers: [session.publicId],
        type: 'm2m',
    };
    let messagesData = chat.messages;


    function isFirstMessage(message, index) {
        const previousMessage = messagesData[index - 1];
        if (message.isTitle) return false;
        if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
        return false;
    }
    function isLastMessage(message, index) {
        const nextMessage = messagesData[index + 1];
        if (message.isTitle) return false;
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
        return false;
    }
    function isTailMessage(message, index) {
        const nextMessage = messagesData[index + 1];
        if (message.isTitle) return false;
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
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
                    destType: chat.type,
                    chat: chat.id,
                    destination,
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

    async function getChat() {
        const chatUpdateResponse = await updateChats(chatId);
        if ( chatUpdateResponse.ok ) {
            const chat = chatUpdateResponse.message.find(
                chat => chat.id === chatId
            );
            messagesData = chat.messages;
            console.log(chat)
        }
    }

    getChat();

    try {
        ws.addHandler(
            {
                tag: 'updates',
                function: (obj)=>{
                    if ( obj.type === 'messages' ) {
                        messagesData = [...messagesData, obj.doc];
                    } else {
                        console.error('Unhandled update mensage:', obj);
                    }
                }
            }
        );
    } catch (err) {
        console.error('Can not set updates handler!!!')
    }

    /* let images = [
        'https://cdn.framework7.io/placeholder/cats-300x300-1.jpg',
        'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
    ]; */

    let people = [
        {
            name: 'Kate Johnson',
            avatar: 'https://cdn.framework7.io/placeholder/people-100x100-9.jpg',
        },
        {
            name: 'Blue Ninja',
            avatar: 'https://cdn.framework7.io/placeholder/people-100x100-7.jpg',
        },
    ];

    let answers = [
        'Yes!',
        'No',
        'Hm...',
    ];

    let responseInProgress = false;

    $: attachmentsVisible = attachments.length > 0;
    $: placeholder = attachments.length > 0 ? $_('Chat.commentPlaceholder') : $_('Chat.messagePlaceholder');

    onMount(() => {
        f7ready(() => {
        messagebarInstance = messagebarComponent.instance();
        });
    });


</script>

<Page>

    <Navbar  backLink="Back">
        <NavTitle>{$_('appNameTitle')} - {$_('Chat.title')} {chat.id}</NavTitle>
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

        <a class="link icon-only" slot="inner-end" on:click={sendMessage}>
        <Icon
            ios="f7:arrow_up_circle_fill"
            aurora="f7:arrow_up_circle_fill"
            md="material:send"
        />
        </a>

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

    <Messages>
        
        <!--
            <MessagesTitle><b>Sunday, Feb 9,</b> 12:58</MessagesTitle>
        -->

        {#each messagesData as message, index (index)}
        
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
            type={message.type}
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

</Page>

<style>
    :global(div.message-avatar) {
        border-radius: 0;
    }
</style>