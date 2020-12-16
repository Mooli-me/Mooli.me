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
</script>

<Page name="home">

  <Navbar>
    <NavTitle>{$_('appNameTitle')} - {$_('FirstRun.wellCome')}</NavTitle>
  </Navbar>

  <Card class="display-flex justify-content-center">  
    <img id="logo" alt="Mooli.me logo" src="/static/logo.png"/>
  </Card>

  <Card>  
    <CardHeader>
      {$_('FirstRun.joinAChatTitle')}
    </CardHeader>
    <CardContent>
      <BlockHeader>
        {$_('FirstRun.joinAChatContent')}
      </BlockHeader>
      <List>
        <ListInput
        outline
        label={$_('FirstRun.codePlaceholder')}
        floatingLabel
        type="text"
        clearButton
        />
      </List>
    </CardContent>
  </Card>

  <Card>  
    <CardHeader>
      {$_('FirstRun.signupTitle')}
    </CardHeader>
    <CardContent>
      <BlockHeader>
        {$_('FirstRun.signupContent')}
      </BlockHeader>
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
