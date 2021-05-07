<script>
  import {
    f7,
    Page,
    Button,
    Block,
    Navbar,
    NavTitle,
    List,
    ListInput,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { sha512 } from '../js/aux.js';

  import { identity, session } from '../js/store.js';

  import Avatar from '../components/Avatar.svelte';

  import { ws } from '../js/webSocket.js';

  let router = f7.view.main.router;
  let password = '';
  let username = '';
  let error;

  async function login () {
    const nameHash = await sha512(`${username}:${password}`);
    let response;
    var request = {
      msgType: 'login',
      nameHash,
    }
    response = await ws.sendObj(request);
    if ( response.ok ) {
      $session.loggedOn = true;
      $session.pubIdentity = request.nameHash;
      router.navigate('/Home/');
    } else {
      if (response.message === "Inexistent nameHash") {
        const request = {
          msgType: 'signon',
          nameHash,
        };
        response = await ws.sendObj(request);
        if (response.ok) {
          login()
        } else {
          error = "No se ha podido crear la cuenta de usuario";
        }
      }
    }
  }

</script>

<Page name="Login">
  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('Login.title')}</NavTitle>
</Navbar>

  <Block>
    {#await sha512(`${username}:${password}`) }
    <Avatar id=''/>
    {:then hash }
    <Avatar id={hash}/>
    {/await}
    <p>Este avatar representa tu identidad.</p>
  </Block>


      <List>
        <ListInput
        outline
        placeholder={$_('Login.usernamePlaceholder')}
        type="text"
        clearButton
        onInput={ (event) => username = event.target.value }
        />
        <ListInput
        outline
        placeholder={$_('Login.passwordPlaceholder')}
        type="password"
        clearButton
        onInput={ (event) => password = event.target.value }
        />
        {#if error}
        <p>{error}</p>
        {/if}
      </List>


  <Button large round fill on:click="{login}">
    {$_('Login.enterButton')}
  </Button>
</Page>
