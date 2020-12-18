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

  var router = f7.view.main.router;
  var password = '';

  async function login () {
    var request = {
      msgType: 'login',
      nameHash: await sha512(`${$identity}:${password}`),
    }
    const response = await ws.sendObj(request);
    if ( response.ok ) {
      $session.loggedOn = true;
      router.navigate('/Main/');
    } else {

    }
  }
</script>

<Page name="Login">
  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('Login.title')}</NavTitle>
</Navbar>

  <Block>
    {#await sha512(`${$identity}:${password}`) }
    <Avatar id=''/>
    {:then hash }
    <Avatar id={hash}/>
    {/await}
  </Block>


      <List>
        <ListInput
        outline
        placeholder={$_('Login.passwordPlaceholder')}
        type="password"
        clearButton
        onInput={ (event) => password = event.target.value }
        />
      </List>


  <Button large round fill on:click="{login}">
    {$_('Login.enterButton')}
  </Button>
</Page>
