import * as d3B from 'd3';
import * as d3Select from 'd3-selection';
import * as topojson from 'topojson';
import * as d3geo from 'd3-geo';
import map from '../assets/adm1_adm2.json';
import provincesVotesRaw from 'raw-loader!./../assets/november-province-results.csv';
import * as d3Jetpack from 'd3-jetpack';
import {event as currentEvent} from 'd3-selection';
import { $ } from "./util"

let d3 = Object.assign({}, d3B, d3Select, d3geo);

const parsed = d3.csvParse(provincesVotesRaw)
const provincesVotes = parsed;

const atomEl = $('.gv-map-wrapper')

let isMobile = window.matchMedia('(max-width: 620px)').matches;

let width = atomEl.getBoundingClientRect().width;
let height = width;

let tooltip = d3.select(".tooltip")

let svg = d3.select('.coropleth-wrapper').append('svg')
.attr('width', width)
.attr('height', height)
.attr('class', 'geo-map')
.style('border', "black")

let projection = d3.geoMercator()

let path = d3.geoPath()
.projection(projection)

projection.fitSize([width, width], topojson.feature(map, map.objects.esp_adm2));

let provincesMap = svg.append('g')

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
.data(topojson.feature(map, map.objects.esp_adm2).features)
.enter()
.append('path')
.attr('d', path)
.attr('id', d => 'p' + d.properties.ID_3)
.attr('class', 'province')
.on('mouseover', mouseover)
.on('mouseout', mouseout)

comunitiesMap
.selectAll('path')
.data(topojson.feature(map, map.objects.esp_adm1).features)
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
	.tspans(d3Jetpack.wordwrap(d.properties.NAME_1, 12), 20)

	label
	.append('text')
	.attr('class', 'cartogram-label')
	.attr('transform', "translate(" + posX + "," + posY + ")")
	.text('')//clear existing text
	.tspans(d3Jetpack.wordwrap(d.properties.NAME_1, 12), 20)

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


function checkOverlapping(box, position){

	labelsAreas.map((area,i) => {

		if(position != i){

			var overlap = rectOverlap(box,area);

			if(overlap)labels[i].node().remove()
		}
		
	})
}

let gvOption =`<option selected="selected">Jump to a province</option>`

provincesVotes.map(p => {

	if(+p.census_counted > 0)
	{
		let acumm = 1;

		deputiesByProvince[+p.province_code] = [];


		if(p.province_name != 'Total nacional'){
			let provinceEntry = `<option class='option' value="${p.province_name}">${p.province_name}</option>`;

			gvOption += provinceEntry;
		}
		
		

		

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

				for(let j = 0; j < deputies; j++)
				{
					let number = acumm;
					if(acumm<10) number = '0' + acumm;
					d3.select('#d' + p.province_code + number)
					.attr('class', party)
					acumm++
				}

			}
		}
	}
} )

d3.select(".gv-province-filter").html(gvOption);

const dropdownOptions = document.querySelectorAll('.gv-dropdown-menu .option');

dropdownOptions.forEach(option => option.addEventListener('click',handleOptionSelected));

function handleOptionSelected(event)
{
	console.log(event.target.innerHTML)


	d3.selectAll(".geo-map .provinces path").classed(" over", true)
	d3.selectAll(".cartogram-wrapper .cartogram path").style('fill-opacity',1)

	tooltip.classed(" over", true)

	tooltip.select('.tooltip-province').html(event.target.innerHTML)

	//d3.select(".geo-map .provinces #p" + d.properties.ID_3).classed(" over", false)
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

function mouseover(d){


	d3.selectAll(".geo-map .provinces path").classed(" over", true)
	d3.select(".geo-map .provinces #p" + d.properties.ID_3).classed(" over", false)

	tooltip.classed(" over", true)

	tooltip.select('.tooltip-province').html(d.properties.NAME_2)
	tooltip.select('.tooltip-deputies').html(d.properties['deputies'])

	if(deputiesByProvince[d.properties.ID_3])
	{
		deputiesByProvince[d.properties.ID_3].map(dep => {

			let row = tooltip.select('.tooltip-results')
			.append('div')
			.attr('class', 'tooltip-row')

			row
			.append('div')
			.attr('class','tooltip-party')
			.html(dep.party)

			row
			.append('div')
			.attr('class','tooltip-deputies')
			.html(dep.deputies)
		})


		d3.selectAll(".cartogram-wrapper .cartogram path").style('fill-opacity',1)
		d3.select(".cartogram-wrapper .cartogram #p" + d.properties.ID_3).style('fill-opacity',0)
	}
}


function mouseout(){

	tooltip.classed(" over", false)
	
	d3.selectAll(".geo-map .provinces path").classed("over", false)

	tooltip.select('.tooltip-results').html('')

	d3.selectAll('.provincia-hex').style('fill-opacity',0)

}

