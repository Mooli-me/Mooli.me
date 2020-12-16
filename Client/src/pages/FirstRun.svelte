<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Card,
    CardContent,
    CardHeader,
    Row,
    Col,
    List,
    ListInput,
    BlockHeader,
    Button,
  } from 'framework7-svelte';

  import {_} from 'svelte-i18n';

  var chatCode;

</script>

<Page name="home">

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('FirstRun.wellCome')}</NavTitle>
  </Navbar>

  <Card class="display-flex justify-content-center">  
    <img id="logo" alt="Mooli.me logo" src="/static/logo.png"/>
  </Card>

  <Card>  
    <CardContent>
      <List>
        <ListInput
        outline
        placeholder={$_('FirstRun.codePlaceholder')}
        type="text"
        clearButton
        onInput={ (event) => chatCode = event.target.value }
        />
      </List>
    </CardContent>
  </Card>

  <Card class="signUpCard" style="position: fixed; bottom: 0px; width: 100vw;">  
    <CardContent>
      <Button large round fill href="/SignOn/">
        {$_('FirstRun.signupButton')}
      </Button>
    </CardContent> 
  </Card>

</Page>

<style>
  img#logo {  
    width: 80vw;
    max-width: 400px;
  }
</style>
