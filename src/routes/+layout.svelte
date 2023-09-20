<script lang="ts">
	import '../app.postcss';
	import { Navbar, NavBrand, NavLi, NavUl, Dropdown, DropdownItem, Chevron} from 'flowbite-svelte'
	import { mouse } from '$lib/stores';
	import {flightdata, flightmenu} from '$lib/stores';
	import { onMount } from 'svelte';


	const clearflight = (target: string = '/') => {
		flightdata.clear();
		window.location.href = target;
	}

	function handleMousemove(event) {
		$mouse = {x: event.clientX, y: event.clientY}
	}


	onMount(() => {
		flightmenu.update((data: Record<string, any>) => {
			data['Load'] = ()=>{clearflight('/upload')};
			data['Clear'] = ()=>{clearflight('/')};
			return data;
		});

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

	</Navbar>

  <div id='page'>
		<slot />
	</div>
		
	
</div>


<style>
	#parent {display:flex; flex-flow:column; height:100vh;}
	#page {flex:1 1 auto}

</style>