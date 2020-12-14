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
    <NavTitle>{$_('appNameTitle')}</NavTitle>
  </Navbar>

  <Card>  
    <CardHeader>
      {$_('FirstRun.wellCome')}
    </CardHeader>
    <CardContent>
      <Row>
        <Col width='20'>
          <em>{$_('FirstRun.simple')}</em>
        </Col>
        <Col width='80'>
          <p>{$_('FirstRun.simpleContent')}</p>
        </Col>
      </Row>
      <Row>
        <Col width='20'>
          <em>{$_('FirstRun.discreet')}</em>
        </Col>
        <Col width='80'>
          <p>{$_('FirstRun.discreetContent')}</p>
        </Col>
      </Row>
    </CardContent>
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
