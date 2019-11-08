import * as d3 from 'd3';
import * as topojson from 'topojson';
import map from '../assets/adm1_adm2.json';
import provincesVotesRaw from 'raw-loader!./../assets/november-province-results.csv';
import oldResults from 'raw-loader!./../assets/old-province-results.csv'
import { wordwrap } from 'd3-jetpack'
import {event as currentEvent} from 'd3-selection';
import { $, $$ } from "./util"
//import * as waffle from "./../js/waffle.js"



const parsed = d3.csvParse(provincesVotesRaw)
const provincesVotes = parsed;
const totalProvinceVotesOld = d3.csvParse(oldResults);

const atomEl = $('.gv-map-wrapper')

let isMobile = window.matchMedia('(max-width: 860px)').matches;

let width = atomEl.getBoundingClientRect().width;
let height = width;

let tooltip = d3.select(".tooltip")

tooltip.select('.tooltip-button')
.on("click", cleanResult)

let svg = d3.select('.coropleth-wrapper').append('svg')
.attr('width', width)
.attr('height', height)
.attr('class', 'geo-map')
.style('border', "black")

let projection = d3.geoMercator()

let path = d3.geoPath()
.projection(projection)

projection.fitSize([width, width], topojson.feature(map, map.objects.adm2));

let provincesMap = svg.append('g')

let provincesMapCover = svg.append('g')

let comunitiesMap = svg.append('g');

let leabelsGroup = svg.append('g');

let labelsAreas = []
let labels = []

let padding = 20;
let deputiesByProvince = [];
let parties = []

provincesMap
.attr('class', "provinces")
.selectAll('path')
.data(topojson.feature(map, map.objects.adm2).features)
.enter()
.append('path')
.style('stroke', 'white')
.style('stroke-width', 1)
.attr('d', path)
.attr('id', d => 'p' + d.properties.ID_3)
.attr('class', 'province')

provincesMapCover
.attr('class', "provinces-cover")
.selectAll('path')
.data(topojson.feature(map, map.objects.adm2).features)
.enter()
.append('path')
.attr('d', path)
.attr('id', d => 'p' + d.properties.ID_3)
.attr('class', 'nodata')
.style('opacity', 0)
.on('mousemove', d => printResult(+d.properties.ID_3, d.properties.NAME_3, d.properties.deputies))
.on('mouseout', d => cleanResult())


comunitiesMap
.selectAll('path')
.data(topojson.feature(map, map.objects.adm1).features)
.enter()
.append('path')
.attr('d', path)
.attr('class', 'comunidad')

.each(d => {

	let label = leabelsGroup.append('g')
	.attr('class', 'label')


	let posX = path.centroid(d)[0];
	let posY = path.centroid(d)[1];

	label
	.append('text')
	.attr('class', 'cartogram-label-outline')
	.attr('transform', "translate(" + posX + "," + posY + ")")
	.text('')//clear existing text
	.tspans(wordwrap(d.properties.NAME_1, 12), 20)

	label
	.append('text')
	.attr('class', 'cartogram-label')
	.attr('transform', "translate(" + posX + "," + posY + ")")
	.text('')//clear existing text
	.tspans(wordwrap(d.properties.NAME_1, 12), 20)

	let boxX1 = label.node().getBBox().x;
	let boxY1 = label.node().getBBox().y;
	let w = label.node().getBBox().width;
	let h = label.node().getBBox().height;

	let box = {x:boxX1, y:boxY1, width: w , height: h};

	labelsAreas.push(box)
	labels.push(label)

})



labelsAreas.map((area,i) => {
	
	checkOverlapping(area, i)
})
 

// FILL OUT THE DROPDOWN MENU AND HANDLE IT

let gvOption =`<option selected="selected">Jump to a province</option>`


map.objects.adm2.geometries.sort(function(a, b) {
   return a.properties.NAME_3.localeCompare(b.properties.NAME_3)
});


map.objects.adm2.geometries.map(province => {

	let provinceEntry = `<option class='option' value="${province.properties.NAME_3}" province-id="${province.properties.ID_3}"province-deputies="${province.properties.deputies}">${province.properties.NAME_3}</option>`;

	gvOption += provinceEntry;

})



d3.select(".gv-province-filter").html(gvOption);

const dropdown = $(".gv-province-filter")

dropdown.addEventListener('change', handleOptionSelected)

const dropdownOptions = document.querySelectorAll('.gv-dropdown-menu .option');

//dropdownOptions.forEach(option => option.addEventListener('select',handleOptionSelected));

function handleOptionSelected(event)
{
	
	const el = $$('.gv-dropdown-menu .option')
		.find( option => option.selected )

	cleanResult()

	printResult(+el.attributes['province-id'].value, el.innerHTML, el.attributes['province-deputies'].value)
}

//-----------------------------------------



// MANAGE RESULTS

provincesVotes.map(p => {

	if(+p.census_counted > 0)
	{
		let acumm = 1;

		deputiesByProvince[+p.province_code] = [];

		let province = topojson.feature(map, map.objects.adm2).features.find(feature => feature.properties.ID_3 == +p.province_code);


		if(p['party 1'] && +p['seats 1'] > 0) d3.select("#p" + +p.province_code).attr('class', p['party 1'])

			for(let i = 1 ; i<80 ; i++){

				if(+p['seats ' + i] > 0)
				{
					let party = p['party ' + i];
					let deputies = +p['seats ' + i];
					let votes = +p['votes ' + i];
					let percentage = +p['percentage ' + i];


					if(parties.indexOf(party) == -1){

						parties.push(party)
					}

					deputiesByProvince[+p.province_code].push({
						"deputies" : deputies,
						"votes" : votes,
						"percentage" : percentage,
						"party" : party
					});

					d3.select('#d' + p.province_code)
					.attr('class', party)

				}
			}
		}
	} )


   // d3.selectAll('.cartogram [class="' + party.party + '"').style('fill', '#' + party.color)

   newPartiesList.map(party => d3.selectAll('.provinces [class="' + party.party + '"').style('fill', '#' + party.color))

    


//----------------------------------------



// PRINT AND CLEAN TOOLTIP

function printResult(id,name,deputies){

	cleanResult()

	let result = provincesVotes.find(province => +province.province_code == +id);

	if(result){

		d3.selectAll(".geo-map .provinces-cover path").style("opacity", 1)
		d3.select(".geo-map .provinces-cover #p" + id).style("opacity", 0)

		tooltip.classed(" over", true)

		tooltip.select('.tooltip-province').html(name)
		tooltip.select('.tooltip-deputies').html(deputies)

		let turnOut = '-';
		let oldTurnOut = parseFloat(totalProvinceVotesOld.find(p => p.id == id).turnout);
		let differenceTurnOut = '-';

		

		if(+result.voters_percentage > 0){
			turnOut = +result.voters_percentage / 100;
			differenceTurnOut = Math.floor(turnOut) - Math.floor(oldTurnOut);
			if(differenceTurnOut > 0)differenceTurnOut = '+' + differenceTurnOut;
		}

		tooltip.select('.tooltip-turnout .turnout').html(turnOut + "%")
		tooltip.select('.tooltip-turnout .old-turnout').html("(" + differenceTurnOut + "%)")


		if(deputiesByProvince[+id])
		{
			deputiesByProvince[+id].map(dep => {

				let row = tooltip.select('.tooltip-results')
				.append('div')
				.attr('class', 'tooltip-row')

				let keyColor = row
				.append('div')
				.attr('id','tooltip-color')
				.attr('class', dep.party)

				row
				.append('div')
				.attr('class','tooltip-party')
				.html(dep.party)

				row
				.append('div')
				.attr('class','tooltip-deputies')
				.html(dep.deputies)


				let f = newPartiesList.find(party => party.party == dep.party);
				console.log('provinces: ', f)
				if(f) keyColor.style('background-color', '#' + f.color)

				
			})


			

		}

		d3.selectAll(".cartogram-wrapper .cartogram path").style('fill-opacity',1)
		d3.select(".cartogram-wrapper .cartogram #p" + id).style('fill-opacity',0)

	}

	else{
		tooltip.select('.tooltip-province').html(name)
		tooltip.select('.tooltip-deputies').html(deputies)

		tooltip.select('.tooltip-turnout .turnout').html("-%")
		tooltip.select('.tooltip-turnout .old-turnout').html("(-%)")

		tooltip.classed(" over", true)

	}
}

function cleanResult(){

	tooltip.classed(" over", false)
	
	d3.selectAll(".geo-map .provinces-cover path").style("opacity", 0)

	tooltip.select('.tooltip-results').html('')

	d3.selectAll('.provincia-hex').style('fill-opacity',0)

}


//----------------------------------------------

//LABELING HANDLERS


function checkOverlapping(box, position){

	labelsAreas.map((area,i) => {

		if(position != i){

			var overlap = rectOverlap(box,area);

			if(overlap)labels[i].node().remove()
		}

})
}


function valueInRange(value, min, max)
{
	return (value <= max) && (value >= min);
}

function rectOverlap(A, B)
{
	var xOverlap = valueInRange(A.x, B.x, B.x + B.width) || valueInRange(B.x, A.x, A.x + A.width);

	var yOverlap = valueInRange(A.y, B.y, B.y + B.height) || valueInRange(B.y, A.y, A.y + A.height);

	return xOverlap && yOverlap;
}


//-----------------------------------------------


window.onscroll = function (e) { 

if(isMobile)cleanResult()
// called when the window is scrolled.  
} 


