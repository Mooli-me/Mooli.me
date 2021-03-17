<script>
	import ViewLayout from './components/ViewLayout.svelte';
	import Button from './components/Button.svelte';
	import Input from './components/Input.svelte';
	import DropDownMenu from './components/DropDownMenu.svelte';

	import TabbedSections from './components/TabbedSections.svelte';
	import ChatIcon from './components/ChatIcon.svelte';

	//id="{item.id}" name="{item.id}" badge="{item.peers.length}
	const sections = [
		{
			title: "Mis chats",
			contents: [
				{
					id: 'SDFS',
					peers: [1,2],
					owner: 'mio',
				},
				{
					id: 'HREN',
					peers: [1,2,3],
					owner: 'mio',
				},
			],
		},
		{
			title: "Otros chats",
			contents:[
				{
					id: 'WERTW',
					peers: [1,2],
					owner: 'no',
				},
				{
					id: 'FJGH',
					peers: [1,2],
					owner: 'no',
				},
			],
		},
	]

	var section = "Principal";

</script>

<main>
	<p on:click="{()=>{section="Principal"}}">Principal</p>
	<p on:click="{()=>{section="Chats"}}">Chats</p>
	<hr/>
	{#if section === "Principal"}
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
	{/if}
	{#if section === "Chats"}
		<TabbedSections sections="{sections}" childComponent="{ChatIcon}"/>
	{/if}

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
