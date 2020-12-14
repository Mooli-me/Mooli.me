<script>
  import {
    f7,
    Page,
    BlockHeader,
    Button,
    Block,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  import { sha512 } from '../js/aux.js';

  import { identity, session } from '../js/store.js';

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
  <BlockHeader>
    {$_('login.title')}
  </BlockHeader>
  <Block>
    {$_('login.instructions')}
  </Block>
  <Block>
    <input bind:value={password} placeholder="{$_('login.passwordPlaceholder')}"/>
  </Block>
  <Button large round fill on:click="{login}">
    {$_('login.enterButton')}
  </Button>
</Page>
