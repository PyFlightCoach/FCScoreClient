import Plot from 'svelte-plotly.js';
import Plotly from 'plotly.js/lib/core';

export const plotlycolours = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'];

export const d3Colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf'
  ];

export const burgColors = [
    'rgb(255, 198, 196)',
    'rgb(244, 163, 168)',
    'rgb(227, 129, 145)',
    'rgb(204, 96, 125)',
    'rgb(173, 70, 108)',
    'rgb(139, 48, 88)',
    'rgb(103, 32, 68)'
];

export const redsColors = ['rgb(255,245,240)',
'rgb(254,224,210)',
'rgb(252,187,161)',
'rgb(252,146,114)',
'rgb(251,106,74)',
'rgb(239,59,44)',
'rgb(203,24,29)',
'rgb(165,15,21)',
'rgb(103,0,13)'];

export const rainbowColors = ['rgb(150,0,90)',
'rgb(0,0,200)',
'rgb(0,25,255)',
'rgb(0,152,255)',
'rgb(44,255,150)',
'rgb(151,255,0)',
'rgb(255,234,0)',
'rgb(255,111,0)',
'rgb(255,0,0)'];

export const redblueColors = ['rgb(0,0,255)',
'rgb(13,0,241)',
'rgb(26,0,228)',
'rgb(40,0,214)',
'rgb(53,0,201)',
'rgb(67,0,187)',
'rgb(80,0,174)',
'rgb(93,0,161)',
'rgb(107,0,147)',
'rgb(120,0,134)',
'rgb(134,0,120)',
'rgb(147,0,107)',
'rgb(161,0,93)',
'rgb(174,0,80)',
'rgb(187,0,67)',
'rgb(201,0,53)',
'rgb(214,0,40)',
'rgb(228,0,26)',
'rgb(241,0,13)',
'rgb(255,0,0)'];



export const colscale = (v: number, vmax: number, scale: string[]) => {

    return scale[Math.round((scale.length-1)*Math.min(v,vmax)/vmax)];

}

//colour = lambda v, vmax, scale=px.colors.sequential.Burg: scale[int((len(scale)-1)*v/vmax)]