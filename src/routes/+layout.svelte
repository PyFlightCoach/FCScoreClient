<script lang="ts">
	import '../app.postcss';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Chevron, DropdownDivider } from 'flowbite-svelte'
	import { Icon } from 'flowbite-svelte-icons';
	import { mouse } from '$lib/stores';
	import {flightdata, flightmenu} from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {example_manlist} from '$lib/api_calls';

	const clearflight = (target: string = '/') => {
		flightdata.clear();
		window.location.href = target;
	}

	function handleMousemove(event) {
		$mouse = {x: event.clientX, y: event.clientY}
	}

	let manlist: string[] =[];

	onMount(() => {
		flightmenu.update((data: Record<string, any>) => {
			data['Load'] = ()=>{clearflight('/upload')};
			data['Clear'] = ()=>{clearflight('/')};
			return data;
		});

		example_manlist().then(res => {manlist=res});

	});

</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="parent" on:mousemove={handleMousemove} >
	<Navbar let:hidden let:toggle>
		<NavBrand href='/'>
			FCScore
		</NavBrand>
		<NavUl {hidden}>
			<NavLi id="nav-menu1" class="cursor-pointer"><Chevron aligned>Flight</Chevron></NavLi>
			<Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
				{#each Object.entries($flightmenu) as [key, item]}
					<DropdownItem on:click={item}>{key}</DropdownItem>	
				{/each}
			</Dropdown> 
		</NavUl>
		<NavUl {hidden}>
			<NavLi id="nav-menu2" class="cursor-pointer"><Chevron aligned>examples</Chevron></NavLi>
			<Dropdown triggeredBy="#nav-menu2" class="w-44 z-20">
				{#each manlist as mn}
					<DropdownItem href={'./analysis/' + mn + '_example/'}>
						{mn}
					</DropdownItem>
				{/each}
			</Dropdown>
		</NavUl>

	</Navbar>

  <div id='page'>
		<slot />
	</div>
		
	
</div>


<style>
	#parent {display:flex; flex-flow:column; height:100vh;}
	#page {flex:1 1 auto}

</style>