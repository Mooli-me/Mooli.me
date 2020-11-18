<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Block,
    Preloader,
  } from 'framework7-svelte';
</script>

<Page name="home">
    <Navbar>
        <NavTitle>IndySMS</NavTitle>
    </Navbar>
    <Block  class="display-flex justify-content-space-evenly align-content-space-around">
        <Preloader size={100}/>
    </Block>
</Page>

<style>

</style>