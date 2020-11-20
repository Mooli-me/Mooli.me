<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Block,
    Preloader,
    List,
    ListInput,
  } from 'framework7-svelte';
  import {_} from 'svelte-i18n';

  import { identity, chats } from '../js/store.js';

  var userPassword;

  async function setNewIdentity () {
    $identity = await crypto.subtle.digest("SHA-512",new TextEncoder("utf-8").encode(`${crypto.getRandomValues(new Uint32Array(10))}:${userPassword}`)).then(hash=>btoa(String.fromCharCode(...new Uint8Array(hash))))
  }


</script>

<Page name="home" class="display-flex justify-content-center" style="height: 100vh;">
    <Navbar>
        <NavTitle>IndySMS</NavTitle>
    </Navbar>
    {#if $identity === null }
    <Block>
      <List>
        <ListInput
        outline
        label={$_('newAccountInsertPassPlaceholder')}
        floatingLabel
        type="text"
        clearButton
        bind:value={userPassword}
        />
        <p>{$_('newAccountYouCanOmitPass')}</p>
      </List>
      <button on:click={setNewIdentity}>{$_('newAccountButton')}</button>
    </Block>
    {:else}
    <Block  class="display-flex align-items-center" style="height: 80%;">
        <Preloader size={100}/>
    </Block>
    {/if}
</Page>

<style>

</style>