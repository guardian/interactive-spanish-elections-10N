import * as d3B from 'd3';
import * as d3Select from 'd3-selection';
import * as topojson from 'topojson';
import * as d3geo from 'd3-geo';
import map from '../assets/adm1_adm2.json';
import provincesVotesRaw from 'raw-loader!./../assets/april-province-results.csv';
import * as d3Jetpack from 'd3-jetpack';
import {event as currentEvent} from 'd3-selection';
import { $ } from "./util"

let d3 = Object.assign({}, d3B, d3Select, d3geo);

const parsed = d3.csvParse(provincesVotesRaw)
const provincesVotes = parsed;

const atomEl = $('.interactive-wrapper')

let isMobile = window.matchMedia('(max-width: 620px)').matches;

let width = isMobile ? atomEl.getBoundingClientRect().width : (atomEl.getBoundingClientRect().width / 2) - 30;
let height = width;

d3.select("#elections-geographical")

let svg = d3.select('#coropleth').append('svg')
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

provincesMap
.attr('class', "provinces")
.selectAll('path')
.data(topojson.feature(map, map.objects.esp_adm2).features)
.enter()
.append('path')
.attr('d', path)
.attr('id', d => 'p' + d.properties.ID_3)
.attr('class', 'province')

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

provincesVotes.map(p => {

	if(p['party 1'] && +p['seats 1'] > 0) d3.select("#p" + +p.province_code).attr('class', p['party 1'])


} )

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

