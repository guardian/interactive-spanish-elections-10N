import * as d3 from 'd3'
import * as topojson from 'topojson'
import {event as currentEvent} from 'd3-selection';
import cartogram from '../assets/spa-hex-adm1-adm2-deputies.json'
import provincesVotesRaw from 'raw-loader!./../assets/november-province-results.csv';
import oldResults from 'raw-loader!./../assets/old-province-results.csv'
import * as d3Jetpack from 'd3-jetpack';
import { $ } from "./util"

const parsed = d3.csvParse(provincesVotesRaw)
const provincesVotes = parsed;
const totalProvinceVotesOld = d3.csvParse(oldResults);
let deputiesByProvince = [];
let turnOutByProvince = [];
let parties = []

const atomEl = $('.gv-map-wrapper')

let isMobile = window.matchMedia('(max-width: 620px)').matches;

let width = atomEl.getBoundingClientRect().width;
let height = width;

let padding = 20;

let tooltip = d3.select(".tooltip")

let svg = d3.select('.cartogram-wrapper').append('svg')
.attr('width', width)
.attr('height', height)
.attr('class', 'cartogram')

let labelsAreas = []
let labels = []
let deputiesCarto = svg.append('g');
let provincesCarto = svg.append('g');
let comunidadesCarto = svg.append('g');
let leabelsGroup = svg.append('g');

let projection = d3.geoMercator()

let path = d3.geoPath()
.projection(projection)

projection.fitSize([width, height], topojson.feature(cartogram, cartogram.objects['spa-hex-adm1']));

let provincesFeatures = topojson.feature(cartogram, cartogram.objects['spa-hex-adm2']).features

deputiesCarto
.selectAll('path')
.data(topojson.feature(cartogram, cartogram.objects['spa-hex-deputies']).features)
.enter()
.append('path')
.attr('d', path)
.attr('id', d => 'd' + d.properties.layer)
.attr('class', 'deputy')

provincesVotes.sort((a,b) => a.province_code - b.province_code)

provincesCarto
.selectAll('path')
.data(topojson.feature(cartogram, cartogram.objects['spa-hex-adm2']).features)
.enter()
.append('path')
.attr('d', path)
.attr('class', 'provincia-hex')
.attr('id', d => 'p' + d.properties.id)
.on('mousemove', d => printResult(d.properties.id, d.properties['name-english'], d.properties.deputies))
.on('mouseout', cleanResult)

comunidadesCarto
.selectAll('path')
.data(topojson.feature(cartogram, cartogram.objects['spa-hex-adm1']).features)
.enter()
.append('path')
.attr('d', path)
.attr('class', 'comunidad-hex')
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
	.tspans(d3Jetpack.wordwrap(d.properties.layer, 12), 20)

	label
	.append('text')
	.attr('class', 'cartogram-label')
	.attr('transform', "translate(" + posX + "," + posY + ")")
	.text('')//clear existing text
	.tspans(d3Jetpack.wordwrap(d.properties.layer, 12), 20)

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


// MANAGE RESULTS

provincesVotes.map(p => {

	let acumm = 1;

	deputiesByProvince[p.province_code] = []


	if(+p.census_counted > 0)
	{

		turnOutByProvince[p.province_code] = +p['voters_percentage'] / 100 + '%'

		for(let i = 1 ; i<80 ; i++){

			if(+p['seats ' + i] > 0)
			{
				let party = p['party ' + i];
				let deputies = +p['seats ' + i];
				let votes = +p['votes ' + i];
				let percentage = +p['percentage ' + i];

				deputiesByProvince[p.province_code].push({
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

		deputiesByProvince[p.province_code].sort((a,b) => b.votes - a.votes);

		acumm = 0;

	}
})


//----------------------------------------


//PRINT AND CLEAN TOOLTIP

function printResult(id,name, deputies){

	cleanResult()

	let result = provincesVotes.find(province => +province.province_code == id);

	if(result){

		d3.selectAll(".geo-map .provinces path").classed(" over", true)
		d3.select(".geo-map .provinces #p" + +id).classed(" over", false)

		tooltip.classed(" over", true)

		tooltip.select('.tooltip-province').html(name)
		tooltip.select('.tooltip-deputies').html(deputies)

		let turnOut = '-';
		let oldTurnOut = parseFloat(totalProvinceVotesOld.find(p => +p.id == +id).turnout);
		let differenceTurnOut = '-';

		if(+result.voters_percentage > 0){
			turnOut = +result.voters_percentage / 100;
			differenceTurnOut = (turnOut - oldTurnOut).toFixed(2);
			if(differenceTurnOut > 0)differenceTurnOut = '+' + differenceTurnOut;
		}

		tooltip.select('.tooltip-turnout .turnout').html(turnOut + "%")
		tooltip.select('.tooltip-turnout .old-turnout').html("(" + differenceTurnOut + "%)")


		if(deputiesByProvince[id])
		{
			deputiesByProvince[id].map(dep => {

				let row = tooltip.select('.tooltip-results')
				.append('div')
				.attr('class', 'tooltip-row')

				row
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
			})


			d3.selectAll(".cartogram-wrapper .cartogram path").style('fill-opacity',1)
			d3.select(".cartogram-wrapper .cartogram #p" + id).style('fill-opacity',0)

		}

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
	
	d3.selectAll('.provincia-hex').style('fill-opacity',0)

	tooltip.select('.tooltip-results').html('')

	d3.selectAll(".geo-map .provinces path").classed("over", false)

}

//----------------------------------------

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


//-----------------------------