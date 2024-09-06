<script lang="ts">
	import PlotSec from '$lib/plots/PlotSec.svelte';
	import type { States } from '$lib/geometry';
	import {
		Fileupload,
		Dropdown,
		DropdownItem,
		Tooltip,
		Button,
		ButtonGroup
	} from 'flowbite-svelte';
	import { listCategories, listSchedules, listManoeuvres } from '$lib/analysis';
	import { onMount } from 'svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { FCJson } from '$lib/api_objects/fcjson';
	import { parseFCJMans } from './splitting';

  export let states: States;
	export let mans: Record<string, any>[] = [
		{ category: undefined, schedule: undefined, manoeuvre: 'Takeoff', stop: undefined }
	];

	export let fcj: FCJson = undefined;

  $: if(fcj) { 
    mans = parseFCJMans(fcj, states.getFCJIndexOffset());
    activeMan = 1;
  };

	//     eg:            F3A            P25      trgle
	let categories: Record<string, Record<string, string[]>> = {};

	let activeMan = 0;
	let range: number[] = [0, states.data.length];
	let msddOpen = false;
	let stddOpen = false;

	const updateRange = (activeMan: number) => {
		const start = activeMan == 0 ? 0 : mans[activeMan - 1].stop;

		let stop = mans[activeMan].stop;

		if (!stop) {
			if (mans[activeMan].manoeuvre == 'Landing') {
				stop = states.data.length;
			} else {
				switch (activeMan) {
					case 0:
						stop = 4500;
						break;
					case 1:
						stop = start + 600;
						break;
					default:
						stop = start + 2 * (start - mans[activeMan - 2].stop);
				}
			}
		}

		return [start, Math.min(stop, states.data.length)];
	};
	$: range = updateRange(activeMan);

	onMount(async () => {
		(await listCategories()).forEach(async (category: string) => {
			categories[category] = {};
			(await listSchedules(category))?.forEach(async (schedule: string) => {
				categories[category][schedule] = await listManoeuvres(category, schedule);
			});
		});
	});

	const setManoeuvre = (
		i: number,
		name: string,
		category: string = undefined,
		schedule: string = undefined
	) => {
		mans[i] = { category, schedule, manoeuvre: name, stop: undefined };
		msddOpen = false;
	};

	const setRange = () => {
		mans[activeMan].stop = Math.min(
			range[1],
			activeMan == mans.length - 1 ? states.data.length : mans[activeMan + 1].stop
		);
		if (
			mans[activeMan].manoeuvre != 'Landing' &&
			mans[activeMan].stop < states.data.length &&
			activeMan == mans.length - 1
		) {
			addMan();
		}
	};
	const addMan = () => {
		if (activeMan < mans.length) {
			const category = mans[activeMan].category;
			const schedule = mans[activeMan].schedule;
			let manoeuvre: string = 'Select';
			if (category && schedule) {
				const manid = categories[category][schedule].indexOf(mans[activeMan].manoeuvre);
				if (manid < categories[category][schedule].length - 1) {
					manoeuvre = categories[category][schedule][manid + 1];
				} else {
					manoeuvre = 'Landing';
				}
			}

			mans.push({
				category,
				schedule,
				manoeuvre,
				stop: undefined
			});
		}
		activeMan += 1;
	};

	const deleteMan = (i: number) => {
		mans.splice(i, 1);
		activeMan = Math.max(activeMan - 1, 0);
	};

	const keyPress = (k: string) => {
		switch (k) {
			case 's':
				if (mans[activeMan].manoeuvre != 'Select') {
					setRange();
				}
				break;
			case 'd':
				range[1] = Math.min(
					range[1] + 50,
					activeMan == mans.length - 1 ? states.data.length : mans[activeMan + 1].stop
				);
				break;
			case 'a':
				range[1] = Math.max(range[1] - 50, range[0]);
				break;
		}
	};

	const clearSplitting = () => {
		activeMan = 0;
		mans = [{ category: undefined, schedule: undefined, manoeuvre: 'Takeoff', stop: undefined }];
		stddOpen = false;
	};

	const getFCJMans = (event) => {
		const reader = new FileReader();
		reader.onload = () => {
			fcj = FCJson.parse(JSON.parse(reader.result as string));
		};
		reader.readAsText(event.target.files[0]);
	};
</script>

<div class="parent">
	<div class="plot">
		<PlotSec flst={states} controls={['slider', 'rangeEndClick']} scale={5} bind:range />
		<Tooltip>Click on the ribbon or slide the slider to adjust the end of active range</Tooltip>
	</div>
	<div class="options">
		<ButtonGroup>
			<Button>Options <ChevronDownOutline /></Button>
			<Dropdown bind:open={stddOpen}>
				<Fileupload on:change={getFCJMans}  />

				<Tooltip>Read the manoeuvre splitting from a Flight Coach json file</Tooltip>
				<DropdownItem on:click={clearSplitting}>Clear Manoeuvres</DropdownItem>
				<Tooltip>Clear the manoeuvre splitting</Tooltip>
        <DropdownItem>Save</DropdownItem>
			</Dropdown>
			<Button>Complete</Button><Tooltip>Finish splitting and move onto scoring</Tooltip>
		</ButtonGroup>
	</div>
	<div class="manSelect">
		<strong>Manoeuvre</strong>
		<strong>Start</strong>
		<strong>End</strong>

		{#each mans as man, i}
			{#if activeMan == i}
				<div class="cell col1">
					<button>{i}: {man.manoeuvre} ▼</button>
					<Dropdown bind:open={msddOpen}>
						<DropdownItem on:click={() => setManoeuvre(i, 'Takeoff')}>Takeoff</DropdownItem>
						<DropdownItem on:click={() => setManoeuvre(i, 'break')}>break</DropdownItem>
						<DropdownItem on:click={() => setManoeuvre(i, 'Landing')}>Landing</DropdownItem>
						{#each Object.entries(categories) as [category, schedules]}
							<DropdownItem>{category} {`\u232A`}</DropdownItem>
							<Dropdown placement="right-start">
								{#each Object.entries(schedules) as [sname, manoeuvres]}
									<DropdownItem>{sname} {`\u232A`}</DropdownItem>
									<Dropdown placement="right-start">
										{#each manoeuvres as mname}
											<DropdownItem on:click={() => setManoeuvre(i, mname, category, sname)}
												>{mname}</DropdownItem
											>
										{/each}
									</Dropdown>
								{/each}
							</Dropdown>
						{/each}
					</Dropdown>
				</div>
				<div class="cell">{i == 0 ? 0 : mans[i - 1].stop}</div>
				<div class="cell">
					{#if man.manoeuvre != 'Select'}
						<button on:click={setRange}>{man.stop || 'Set Range'}</button><Tooltip
							>Set the end point of this manoeuvre to the end of the active range (or press 's')</Tooltip
						>
					{/if}
				</div>
				{#if man.stop && range[1] < states.data.length && activeMan == mans.length - 1}
					<div class="cell">
						<button on:click={addMan}>+</button><Tooltip>Add Manoeuvre</Tooltip>
					</div>
				{/if}
			{:else}
				<div class="cell col1">
					<button
						on:click={() => {
							activeMan = i;
						}}>{man.manoeuvre}</button
					><Tooltip>Activate Manoeuvre</Tooltip>
				</div>
				<div class="cell">{i == 0 ? 0 : mans[i - 1].stop}</div>
				<div class="cell">{man.stop}</div>
				<div class="cell">
					<button
						on:click={() => {
							deleteMan(i);
						}}><small>X</small></button
					>
				</div>
			{/if}
		{/each}
	</div>
	<div class="maninfo">
		<strong>Category:</strong>
		<p>{mans[activeMan].category || '-'}</p>
		<strong>Schedule:</strong>
		<p>{mans[activeMan].schedule || '-'}</p>
		<strong>Manoeuvre:</strong>
		<p>{mans[activeMan].manoeuvre}</p>
	</div>
</div>

<svelte:window
	on:keydown={(e) => {
		keyPress(e.key);
	}}
/>

<style>
	strong {
		justify-self: center;
	}
	small {
		font-size: medium;
		color: darkgray;
	}
	.parent {
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: min-content 1fr min-content;
		gap: 1em;
	}
	.plot {
		grid-row: 1/4;
	}
	.manSelect {
		display: grid;
		grid-template-columns: 2fr 2fr 2fr 1fr;
		grid-gap: 0px;
		grid-auto-rows: min-content;
	}
	.options {
		grid-column: 2;
	}
	button {
		height: 10px;
		white-space: nowrap;
		display: inline-block;
	}

	.cell {
		align-content: center;
		font-size: medium;
		justify-self: center;
		margin-right: 2px;
		margin-left: 2px;
	}

	.col1 {
		grid-column: 1;
	}

	.maninfo {
		grid-column: 2;
		grid-row: 3;
		display: grid;
		grid-template-columns: min-content max-content;
		justify-self: stretch;
	}
</style>
