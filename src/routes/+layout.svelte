<script lang="ts">
	import '../app.css';
	import '../app.postcss';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Helper,
		NavHamburger,
		Checkbox,
		Radio,
		Input
	} from 'flowbite-svelte';
	import {
		fcj, bin, manNames,
		navitems,
		optimise,
		selManID,
		custom_server,
		mouse,
		server,
		difficulty,
		truncate,
		selectedResult, fa_version
	} from '$lib/stores';
	import { loadExample, exportFCJ, analyseAll } from '$lib/analysis';
	import { clearAnalysis } from '$lib/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	$: $difficulty = Math.round($difficulty);
	let active_server =
		{
			'http://localhost:5000': 'local',
			'https://madeupmodels.com:5010': 'UK'
		}[$server] || 'custom';

	$: $server = {
		local: 'http://localhost:5000',
		UK: 'https://madeupmodels.com:5010',
		custom: $custom_server
	}[active_server]!;


	$: tabname = $bin ? $bin.name : $fcj ? $fcj.short_name : 'FCScore';

	let fddopen = false;


</script>

<svelte:head><title>{tabname}</title></svelte:head>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	id="parent"
	on:mousemove={(event) => {
		$mouse = { x: event.clientX, y: event.clientY };
	}}
>
	<div>
		<!-- svelte-ignore missing-declaration -->
		<Navbar let:hidden let:toggle>
			<NavBrand href={base + '/'}>FCScore</NavBrand>

			<NavHamburger on:click={toggle} />

			<NavUl {hidden}>
				{#if $page.url.pathname.includes('manoeuvre')}
					{#each $navitems as ni}
						<NavLi class="cursor-pointer" href={ni.href} on:click={ni.onclick}>{ni.name}</NavLi>
					{/each}
				{/if}
			</NavUl>

			<NavUl {hidden}>
				<NavLi class="cursor-pointer">Options</NavLi>
				<Dropdown class="w-80 z-20">
					<Helper class="ps-6">Analysis Server</Helper>
					<DropdownItem><Radio bind:group={active_server} value="local">Local</Radio></DropdownItem>
					<DropdownItem><Radio bind:group={active_server} value="UK">UK</Radio></DropdownItem>
					<DropdownItem
						><Radio bind:group={active_server} value="custom">
							<Input type="url" disabled={active_server != 'custom'} bind:value={$custom_server} />
						</Radio></DropdownItem
					>
					<DropdownDivider />
					<Helper class="ps-6">Analysis Options</Helper>
					<DropdownItem>
						<Checkbox bind:checked={$optimise}>Optimise Alignment</Checkbox>
					</DropdownItem>
					<DropdownDivider />
					<Helper class="ps-6">Results to Display</Helper>
					{#each [1, 2, 3] as diff}
						<DropdownItem>
							<Radio bind:group={$difficulty} value={diff}>
								{['Easy', 'Medium', 'Hard'][diff - 1]}
							</Radio>
						</DropdownItem>
					{/each}
					<DropdownDivider />
					<DropdownItem><Checkbox bind:checked={$truncate}>Truncate</Checkbox></DropdownItem>
				</Dropdown>
				{#if $manNames}
					<NavLi class="cursor-pointer">Manoeuvres</NavLi>
					<Dropdown class="w-44 z-20">
						{#each $manNames as name, i}
							<DropdownItem
								on:click={() => {
									$selManID = i;
									goto(base + '/analysis/manoeuvre');
								}}>{name}</DropdownItem
							>
						{/each}
					</Dropdown>
				{/if}

				<NavLi class="cursor-pointer">Flight</NavLi>
				<Dropdown class="w-44 z-20" bind:open={fddopen}>

					{#if $manNames}
						<DropdownItem on:click={()=>clearAnalysis()} href={base + '/'}>Clear</DropdownItem>
						<DropdownDivider />
						<Helper>{tabname}</Helper>
						{#if !$page.url.pathname.endsWith('analysis')}
							<DropdownItem href={base + '/analysis'}>Analysis</DropdownItem>
						{/if}
						<DropdownItem on:click={()=>analyseAll($optimise, true)}>Run All</DropdownItem>
						<DropdownItem on:click={()=>analyseAll($optimise, false)}>Run Remaining</DropdownItem>

						<DropdownItem on:click={exportFCJ}>export</DropdownItem>

						<DropdownDivider />
						<Helper>Available Analyses</Helper>
						{#if $fcj}
							{#each $fcj.fcs_scores as res}
								{#if !($fa_version == res.fa_version)}
									<DropdownItem>
										<Radio bind:group={$selectedResult} value={res.fa_version}>
											{res.fa_version}
										</Radio>
									</DropdownItem>
								{/if}
							{/each}
						{/if}
						<Radio bind:group={$selectedResult} value={$fa_version}>Latest: {$fa_version}</Radio>
					{:else}
						<DropdownItem href={base + '/upload'}>Load</DropdownItem>
						<DropdownItem
							on:click={() => {loadExample().then(()=>{
								  fddopen=false;
									goto(base + '/analysis');
							})}}
							data-sveltekit-preload-data="tap">example</DropdownItem
						>
					{/if}
				</Dropdown>
				<NavLi
					id="info"
					class="cursor-pointer"
					href="https://pfcdocumentation.readthedocs.io/fcscore/index.html"
					target="_blank">Info</NavLi
				>
			</NavUl>
		</Navbar>
	</div>
	<slot />
</div>

<style>
	#parent {
		display: grid;
		height: 100vh;
		width: 100%;
		grid-template-rows: min-content 1fr;
	}
</style>
