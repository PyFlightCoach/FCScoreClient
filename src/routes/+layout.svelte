<script lang="ts">
	import '../app.postcss';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Chevron, DropdownDivider } from 'flowbite-svelte'

	import {flightdata} from '$lib/stores';

	const clearflight = () => {
		flightdata.clear();
		window.location.href = '/';
	}


</script>


<div id="parent">
	<Navbar let:hidden let:toggle>
		<NavBrand href='/'>
			FCScore
		</NavBrand>
		<NavUl {hidden}>
			<NavLi id="nav-menu1" class="cursor-pointer"><Chevron aligned>Flight</Chevron></NavLi>
			<Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
			<DropdownItem href="./upload">Load</DropdownItem>
			<DropdownItem>Save</DropdownItem>
			<DropdownDivider />
			<DropdownItem on:click={clearflight}>Clear</DropdownItem>
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