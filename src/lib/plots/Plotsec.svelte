<script lang='ts'>
  
  import Plotly from '$lib/plots/Plotly.svelte'; 
  import {type OBJ, ribbon, boxtrace, modeltrace} from '$lib/plots/traces';
  import {layout3d} from '$lib/plots/layouts';  
  import {colours} from '$lib/plots/styling';
  import {split_states, type State} from '$lib/geometry';
  
  import {Checkbox, BottomNav, BottomNavItem, Select} from 'flowbite-svelte';

  export let state: State[];
  export let obj: OBJ;
  export let template: State[] | null = null;
  export let show_box= false;
  export let nmodels= 3;
  export let highlight: number | null = null;
  export let show_models = false;
  export let show_controls = true;
  export let extranavs: BottomNavItem[] =[];

  $: states = split_states(state);

  let element = "select element";
  $: if (highlight!=null) {
    element=Object.keys(states)[highlight]
  };
  //$: if (element!='select element') {highlight=Object.keys(states).indexOf(element)};

  const select_model_sts = (st: State[]) => {
    const spacing = Math.floor(st.length /(nmodels-1));
    const sts = [];
    for (let i = 0; i <= nmodels-2; i++) {
      sts.push(st[i*spacing]);
    }
    sts.push(st[st.length - 1]);
    return sts;
  }


  const create_st_traces = (sts: Record<string, State[]>, showmodels: boolean, showbox: boolean) => {
    const trs = [];

    
    for (let i = 0; i < Object.keys(sts).length; i++) {
      let k = Object.keys(sts)[i];
      let v = Object.values(sts)[i];
      
      const props = {
        color: colours[i % colours.length],
        name: k
      };
      if ((i == highlight) || (highlight == null)) {

        if (showmodels){
          trs.push(...modeltrace(
            select_model_sts(v), 
            obj, 
            {opacity: 1.0, ...props}
          ));
        }
        

        trs.push(ribbon(v, 3, {opacity: 0.8, showlegend:true, ...props}));
      } else {
        trs.push(ribbon(v, 3, {opacity: 0.2, ...props}));
      } 
      
    }
    if (showbox) {trs.push(boxtrace())};
    return trs;
  }

  
  $: traces = create_st_traces(states, show_models, show_box);



  $: if (template != null) {
    traces.push(ribbon(template, 3, {opacity: 0.2, color: 'grey', name: 'template'}));
  }

</script>

<div id="parent">
  
  <Plotly 
    data={traces} 
    layout={layout3d}
  />

  {#if show_controls}
    <BottomNav classInner="grid-cols-5" id="adjust-split">
      <Select 
        bind:value={element} 
        items={['Select Element'].concat(...Object.keys(states)).map((el) => {return {value: el, name: el};})}
        on:change={() => {
          if (element == 'Select Element') {
            highlight=null; 
            show_models=false;
          } else {
            highlight=Object.keys(states).indexOf(element); 
            show_models=true;
          }
        }}
      />
      <BottomNavItem><Checkbox bind:checked={show_models}>Show Models</Checkbox></BottomNavItem>
      <BottomNavItem><Checkbox bind:checked={show_box}>Show Box</Checkbox></BottomNavItem>
      <slot />
    </BottomNav>
  {/if}

</div>



<style>
  #parent {height: 100%; position:fixed}
</style>