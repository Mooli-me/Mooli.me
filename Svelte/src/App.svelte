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
		<DropDownMenu slot="hright">
			<div slot="menuContents">
				<p><a>Login</a></p>
				<p><a>Crear galería anónima<a/></p>
			</div>
		</DropDownMenu>
		<div slot="main">
			<img alt="logo" src="/static/logotext.svg"/>
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
		color: var(--font-color);
	}
	:global(body) {
		padding: 0px;
		margin: 0px;
	}
	:global(*) {
		--bars-background-color: #f6d5ffff;
		--background-color: white;
		--font-color: #ab37c8ff;
	}
</style>
