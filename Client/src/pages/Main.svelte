<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Block,
    Preloader,
  } from 'framework7-svelte';
</script>

<Page name="home" class="display-flex justify-content-center" style="height: 100vh;">
    <Navbar>
        <NavTitle>IndySMS</NavTitle>
    </Navbar>
    <Block  class="display-flex align-items-center" style="height: 80%;">
        <Preloader size={100}/>
    </Block>
</Page>

<style>

</style>