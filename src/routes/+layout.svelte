<script lang="ts">
	import '../app.postcss';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Chevron, DropdownDivider } from 'flowbite-svelte'

	import {mans} from '$lib/stores';

	const clearflight = () => {
		mans.set({});
		window.location.href = '/';
	}


</script>

<Navbar let:hidden let:toggle>
	<NavBrand>
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

<slot />
