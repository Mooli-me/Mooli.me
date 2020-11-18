<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Link,
    Toolbar,
    Card,
    CardContent,
    CardHeader,
    BlockTitle,
    Button,
  } from 'framework7-svelte';
</script>

<Page name="home">
  <!-- Top Navbar -->
  <Navbar>
    <NavTitle>IndySMS</NavTitle>
  </Navbar>
  <!-- Toolbar 
  <Toolbar bottom>
    <Link>Left Link</Link>
    <Link>Right Link</Link>
  </Toolbar>
  <!-- Page content -->
  
  <Card expandable >  
    <!--CardContent style="background-size: cover; background-image: url(https://thumbs.dreamstime.com/z/people-group-young-man-woman-hipster-casual-clothes-stand-line-chat-box-vector-illustration-66733018.jpg)"-->
    <CardContent>
      <CardHeader>
        Join a chat
      </CardHeader>
      <Link cardClose color="black" class="card-opened-fade-in" style="position: absolute; right: 15px; top: 15px" iconF7="xmark_circle_fill" />
      <BlockTitle>Simple. No installations. Only your browser.</BlockTitle>
      <p>No phone number, no e-mail, no personal data. Only communicate.</p>
    </CardContent>
  </Card>

  <Card expandable> 
    <!--CardContent style="background-size: cover; background-image: url(https://thumbs.dreamstime.com/z/people-group-young-man-woman-hipster-casual-clothes-stand-line-chat-box-vector-illustration-66733018.jpg)"-->
    <CardContent>
      <CardHeader>
        Own your chats
      </CardHeader>
      <Link cardClose color="black" class="card-opened-fade-in" style="position: absolute; right: 15px; top: 15px" iconF7="xmark_circle_fill" />
      <BlockTitle>Stay in contacts with no privacy leaks.</BlockTitle>
      <p>No phone number, no e-mail, no personal data. Only communicate.</p>
    </CardContent>
  </Card>



</Page>
