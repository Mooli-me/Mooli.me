<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Card,
    List,
    ListInput,
    Button,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  export var chatCode;

</script>

<Page name="home"  class="display-flex justify-content-center" style="height: 100vh;">

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('KnockKnock.enteringTo')} {chatCode}</NavTitle>
  </Navbar>

  <Card class="display-flex justify-content-center">  
    <img id="logo" alt="Mooli.me logo" src="/static/logo.png"/>
  </Card>


      <List>
        <ListInput
        outline
        placeholder={$_('FirstRun.codePlaceholder')}
        type="text"
        clearButton
        onInput={ (event) => chatCode = event.target.value }
        />
      </List>

      <Button large round fill href="/SignOn/">
        {$_('FirstRun.enterChat')}
      </Button>

      <Button style="position: fixed; bottom: 0px; width: 80vw;" large fill href="/SignOn/">
        {$_('FirstRun.signupButton')}
      </Button>

</Page>

<style>
  img#logo {  
    width: 80vw;
    max-width: 200px;
  }
</style>
