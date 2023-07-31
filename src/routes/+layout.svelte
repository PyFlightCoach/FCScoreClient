<script>
	import '../app.postcss';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Chevron, DropdownDivider } from 'flowbite-svelte'

</script>

<Navbar let:hidden let:toggle>
	<NavBrand>
		FCScore
	</NavBrand>
	<NavUl {hidden}>
	  <NavLi id="nav-menu1" class="cursor-pointer"><Chevron aligned>Flight</Chevron></NavLi>
	  <Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
		<DropdownItem>Load</DropdownItem>
		<DropdownItem>Save</DropdownItem>
		<DropdownDivider />
		<DropdownItem>Clear</DropdownItem>
	  </Dropdown> 
	  <NavLi href="/services">Schedule</NavLi>
	  <NavLi href="/pricing">Scoring</NavLi>
	</NavUl>
  </Navbar>

<slot />
