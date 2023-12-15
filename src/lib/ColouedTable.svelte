<script lang="ts">
  import { max  } from '$lib/geometry';
  import {d3Colors, colscale, redsColors} from '$lib/plots/styling';

	export let data: Record<string, Record<string, number>>;
  export let activeRow: null|string = null;
  export let activeCol: null|string = null;
  export let colorCols: null|string[] = null;


  $: rowNames = Object.keys(data);
  $: colNames = Object.keys(data[rowNames[0]]);
  $: colCols = colorCols == null ? colNames : colorCols;

  $: maxVal=max(Object.values(data).map(s=>max(colCols.map(k=>s[k]))));


  const activateCell = (row: string|null, col: string|null) => {
    console.log(colNames)
    activeRow = row;
    activeCol = col;
  }

  const getColor = (row: string, col: string) => {
    if (colCols.indexOf(col) >= 0) {
      return colscale(data[row][col], maxVal, redsColors)
    } else {
      return 'white'
    } 
  }
</script>


<div 
  class='container' 
  style:grid-template-columns={'repeat(' + (colNames.length+1).toString() + ',1fr)'}
>
  
  <button class='cell rotated' on:click={()=>activateCell(null, null)}>Clear Selection</button>
  {#each colNames as col}
    <div class='cell rotated' class:selected={col==activeCol}>{col}</div>
  {/each}

  {#each rowNames as row} 
    <button 
        on:click={(e)=>{activateCell(row, null);}} 
        class = 'cell' class:selected={row==activeRow}
        style:background-color={d3Colors[rowNames.indexOf(row)% d3Colors.length]}
        >
      {row}
    </button>  
    
    {#each colNames as col}
      <button 
        class = 'cell'
        class:selected={row==activeRow && col==activeCol}
        on:click={(e)=>{activateCell(row, col);}}
        style:background-color={getColor(row, col)}
      >
        {#if data[row][col] != null}
          {data[row][col].toFixed(2)}
        {:else}
          <p>-</p>
        {/if}
      </button>
    {/each}
  {/each}  

</div>

<style>
  .cell {align-self: start;}
  .cell.rotated {writing-mode:vertical-rl; align-items: center; width:100%; height:100%;}
  .cell.selected {border: 3px black solid;}
  .container {width: 100%; display:grid;  align-content: start; justify-content: start;}
</style>