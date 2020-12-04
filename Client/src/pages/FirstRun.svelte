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
      {$_('firsRunIntroCardTitle')}
    </CardHeader>
    <CardContent>
      <Row>
        <Col width='20'>
          <em>{$_('firsRunIntroSimpleTitle')}</em>
        </Col>
        <Col width='80'>
          <p>{$_('firsRunIntroSimpleContent')}</p>
        </Col>
      </Row>
      <Row>
        <Col width='20'>
          <em>{$_('firsRunIntroDiscreetTitle')}</em>
        </Col>
        <Col width='80'>
          <p>{$_('firsRunIntroDiscreetContent')}</p>
        </Col>
      </Row>
    </CardContent>
  </Card>

  <Card>  
    <CardHeader>
      {$_('joinAChatTitle')}
    </CardHeader>
    <CardContent>
      <BlockHeader>
        {$_('joinAChatContent')}
      </BlockHeader>
      <List>
        <ListInput
        outline
        label={$_('joinAChatInputCodeLabel')}
        floatingLabel
        type="text"
        clearButton
        />
      </List>
    </CardContent>
  </Card>

  <Card>  
    <CardHeader>
      {$_('signupTitle')}
    </CardHeader>
    <CardContent>
      <BlockHeader>
        {$_('signupContent')}
      </BlockHeader>
      <Button large round fill href="/Main/">
        {$_('signupButton')}
      </Button>
    </CardContent>
  </Card>

</Page>
