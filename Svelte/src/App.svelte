<script>
	import ViewLayout from './components/ViewLayout.svelte';
	import Button from './components/Button.svelte';
	import Input from './components/Input.svelte';
	import DropDownMenu from './components/DropDownMenu.svelte';
</script>

<main>
	<ViewLayout>
		<div slot="hleft"></div>
		<div slot="hcenter"></div>
		<DropDownMenu slot="hright"/>
		<div slot="main">
			<img alt="logo" src="/static/logo.svg"/>
			<div id="form">
				<p>Te han invitado a una galería?</p>
				<Input type="text" placeholder="Escribe tú código"/>
				<Button>entrar</Button>
			</div>
		</div>
	</ViewLayout>
</main>

<style>
	div {
		display: inherit;
		flex-direction: inherit;
        align-items: inherit;
        justify-content: inherit;
		flex-wrap: inherit;
	}
	div[slot="main"] {
		justify-content: space-evenly;
		flex-grow: 1;
	}
	img[alt=logo] {
		max-width: 60%;
		max-height: 60%;
	}
	* {
		background-color: var(--background-color);
		color: var(--font-color);
	}
	:global(body) {
		padding: 0px;
		margin: 0px;
	}
	:global(*) {
		--bars-background-color: #202020;
		--background-color: black;
		--font-color: grey;
	}
</style>