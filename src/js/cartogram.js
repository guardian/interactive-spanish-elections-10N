import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import * as topojson from 'topojson'
import * as d3geo from 'd3-geo'
import {event as currentEvent} from 'd3-selection';
import cartogram from '../assets/spa-hex-adm1-adm2-deputies.json'
import provincesVotesRaw from 'raw-loader!./../assets/november-province-results.csv';
import * as d3Jetpack from 'd3-jetpack';
import { $ } from "./util"

let d3 = Object.assign({}, d3B, d3Select, d3geo);

const parsed = d3.csvParse(provincesVotesRaw)
const provincesVotes = parsed;
let deputiesByProvince = [];
let parties = []

const atomEl = $('.interactive-wrapper')

let isMobile = window.matchMedia('(max-width: 620px)').matches;

let maxWidth = atomEl.getBoundingClientRect().width;
let maxHeight = maxWidth - 100;

let width = isMobile ? atomEl.getBoundingClientRect().width : (atomEl.getBoundingClientRect().width / 2) - 30;
let height = width;

let padding = 20;

let tooltip = d3.select("#gv-cartogram .tooltip")

let svg = d3.select('#gv-cartogram #cartogram').append('svg')
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
.on('mouseover', mouseover)
.on('mouseout', mouseout)
.on("mousemove", mousemove)

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


function checkOverlapping(box, position){

	labelsAreas.map((area,i) => {

		if(position != i){

			var overlap = rectOverlap(box,area);

			if(overlap)labels[i].node().remove()
		}
		
	})
}


let psoeVotes = 0;
let podemosVotes = 0;
let ercVotes = 0;
let juntsVotes = 0;
let ppVotes = 0;


provincesVotes.map(p => {


	//console.log(p)

	//let results = provincesVotes.find(v => v.province_code === p['province-code'])

	//let p.province_code = p.province_code;

	let acumm = 1;

	deputiesByProvince[p.province_code] = []


	if(+p.census_counted > 0)
	{

		for(let i = 1 ; i<80 ; i++){

			if(+p['seats ' + i] > 0)
			{
				let party = p['party ' + i];
				let partyBeauty = party;
				let deputies = +p['seats ' + i];
				let votes = +p['votes ' + i];
				let percentage = +p['percentage ' + i];

				if(party == "PODEMOS-EUIB") partyBeauty = 'Podemos-EUIB';
				if(party == "PODEMOS-EU-MAREAS EN COMÚN-EQUO") partyBeauty = 'Podemos-EU-MAREAS EN COMÚN-EQUO';
				if(party == "PODEMOS-EUPV") partyBeauty = 'Podemos-EUPV';
				if(party == "PODEMOS-IU-EQUO") partyBeauty = 'Podemos-IU-EQUO';
				if(party == "PODEMOS-IU-EQUO-AAeC") partyBeauty = 'Podemos-IU-EQUO-AAeC';
				if(party == "PODEMOS-IU-EQUO-BATZARRE") partyBeauty = 'Podemos-IU-EQUO-BATZARRE';
				if(party == "PODEMOS-IU-EQUO BERDEAK") partyBeauty = 'Podemos-IU-EQUO BERDEAK';
				if(party == "PODEMOS-IU LV CA-EQUO")partyBeauty = 'Podemos-IU LV CA-EQUO';
				if(party == "PODEMOS-IX-EQUO" )partyBeauty = 'Podemos-IX-EQUO';
				
				if(party == "Cs") partyBeauty = 'Citizens';

				let partyToKey = partyBeauty;

				if(partyBeauty == 'Podemos-EUIB') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == 'Podemos-EU-MAREAS EN COMÚN-EQUO') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == 'Podemos-EUPV') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == 'Podemos-IU-EQUO') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == 'Podemos-IU-EQUO-AAeC') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == 'Podemos-IU-EQUO-BATZARRE') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == 'Podemos-IU-EQUO BERDEAK') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == 'Podemos-IU LV CA-EQUO') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == 'Podemos-IX-EQUO') partyToKey = 'Podemos and coalitions';
				if(partyBeauty == "ECP-GUANYEM EL CANVI" ) partyToKey = 'Podemos and coalitions';


				if(partyBeauty == 'PP-FORO') partyToKey = 'PP';

				if(partyBeauty == "ERC-SOBIRANISTES") partyToKey = 'ERC'
				if(partyBeauty == "ERC-CATSÍ") partyToKey = 'ERC'
				if(partyBeauty == "ERPV") partyToKey = 'ERC'

				if(partyBeauty == "JxCAT-JUNTS") partyToKey = 'JxCAT-JUNTS'
				if(partyBeauty == "CDC") partyToKey = 'JxCAT-JUNTS'

				if(partyBeauty == "PSC") partyToKey = "PSOE"
				if(partyBeauty == "PSdeG-PSOE") partyToKey = "PSOE"
				if(partyBeauty == "PSE-EE (PSOE)") partyToKey = "PSOE"
				if(partyBeauty == "PSOE") partyToKey = "PSOE"
				if(partyBeauty == "PSOE") partyToKey = "PSOE"


				if(parties.indexOf(partyToKey) == -1){

					parties.push(partyToKey)
				}

				deputiesByProvince[p.province_code].push({
					"deputies" : deputies,
					"votes" : votes,
					"percentage" : percentage,
					"party" : partyBeauty
				});

				for(let j = 0; j < deputies; j++)
				{
					let number = acumm;
					if(acumm<10) number = '0' + acumm;
					d3.select('#d' + p.province_code + number)
					.attr('class', partyBeauty)
					acumm++
				}

			}
			
		}

		deputiesByProvince[p.province_code].sort((a,b) => b.votes - a.votes);

		acumm = 0;

	}
	

	

})

function mouseover(d){

	d3.selectAll('.provincia-hex').style('fill-opacity',1)
	d3.select(this).style('fill-opacity',0)

	tooltip.classed(" over", true)

	tooltip.select('.tooltip-province').html(d.properties['name-english'])
	tooltip.select('.tooltip-deputies').html(d.properties['deputies'])

	if(deputiesByProvince[d.properties.id])
	{
		deputiesByProvince[d.properties.id].map(dep => {

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

		tooltip.style('top', getPos(currentEvent).posY + 'px')
		tooltip.style('left', getPos(currentEvent).posX + 'px')

		d3.selectAll(".geo-map .provinces path").classed("over", true)
		d3.select(".geo-map #p" + +d.properties.id).classed("over", false)
	}
}


function mouseout(){

	tooltip.classed(" over", false)
	
	d3.selectAll('.provincia-hex').style('fill-opacity',0)

	tooltip.select('.tooltip-results').html('')

	d3.selectAll(".geo-map .provinces path").classed("over", false)

}

function mousemove(){


	tooltip.style('top', getPos(currentEvent).posY + 'px')
	tooltip.style('left', getPos(currentEvent).posX + 'px')
	
}


function getPos(currentEvent){

	let left = document.getElementById('gv-cartogram').getBoundingClientRect().x;
	let top = document.getElementById('cartogram').getBoundingClientRect().y;

	let tWidth = +tooltip.style("width").split('px')[0]
	let tHeight = +tooltip.style("height").split('px')[0]

	let posX = 0;
	let posY = currentEvent.clientY - top + padding

	if(currentEvent.clientX - left > width /2){
		posX += width - tWidth
	}

	if(currentEvent.clientY - top > height /2){
		posY -= tHeight + padding * 2
	}

	return {posX:posX, posY:posY}
}

/*svg.on("click", function() {
  console.log(projection.invert(d3.mouse(this)));
});

*/

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