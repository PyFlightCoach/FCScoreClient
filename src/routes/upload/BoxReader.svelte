<script lang="ts">
	import { Origin } from '$lib/fcjson';
	import {
		Helper,
		Button,
		NumberInput,
		Fileupload,
		Radio,
		Dropdown,
		DropdownItem, DropdownDivider
	} from 'flowbite-svelte';
	import { GPS } from '$lib/geometry';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { FCJson, type FCJMan } from '$lib/fcjson';
	import {createEventDispatcher} from 'svelte';
	import DgPlot from '../../routes/analysis/manoeuvre/intra/DGPlot.svelte';
	const dispatch = createEventDispatcher();

	export let origin: Origin = new Origin(0, 0, 0, 0, 0, 0);
  export let kind: string = 'F3A'
	let file: File;

  const loadBoxFile = (event) => {
		file = event.target.files[0]
		const reader = new FileReader();

		reader.onload = (e) => {
			const contents = reader.result as string;

			if (contents.startsWith('Emailed box data for F3A Zone Pro')) {
				const data = contents.split('\n');

				origin = Origin.from_centre(
					new GPS(parseFloat(data[2]), parseFloat(data[3]), parseFloat(data[6])),
					new GPS(parseFloat(data[4]), parseFloat(data[5]), parseFloat(data[6]))
				);
			} else {
				origin = FCJson.parse(JSON.parse(contents)).origin;
			}
			dispatch('newOrigin', {origin});
		};
		reader.readAsText(file);
	};

	const saveBox = () => {
		console.log(origin);
	};
</script>

<Button>Box <ChevronDownOutline /></Button>
<Dropdown>
	{#if origin}
		<DropdownItem>Upload F3A Zone or FC JSON {`\u232A`}</DropdownItem>
		<Dropdown placement="left-start">
			<DropdownItem>
				<Fileupload on:change={loadBoxFile} accept=".F3A, .f3a, .json" />
			</DropdownItem>
		</Dropdown>
		<DropdownItem>
      <Helper>Pilot Latiude</Helper>
      <NumberInput bind:value={origin.lat} step="0.0001" />
    </DropdownItem>
		<DropdownItem>
      <Helper>Pilot Longitude</Helper>
      <NumberInput bind:value={origin.lng} step="0.0001" />
    </DropdownItem>
		<DropdownItem>
      <Helper>Pilot Altitude Above Sea Level</Helper>
      <NumberInput bind:value={origin.alt} step="1.0" />
    </DropdownItem>
		<DropdownItem>
      <Helper>Pilot Heading</Helper>
      <NumberInput bind:value={origin.heading} step="1.0" />
    </DropdownItem>
		<DropdownItem on:click={saveBox}>Export F3A Zone</DropdownItem>
    <DropdownDivider />
    <DropdownItem>
      {#each ['F3A', 'IAC'] as _kind}
      <Radio bind:group={kind} value={_kind}>{_kind}</Radio> 
      {/each}
    </DropdownItem>
	{/if}
</Dropdown>
