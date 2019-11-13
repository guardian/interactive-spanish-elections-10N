import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import * as topojson from 'topojson'
import * as d3geo from 'd3-geo'
import csv from 'csv-parse/lib/sync'
import map from '../assets/admn1_admn2'
import municipalities from '../assets/municipios'
//import electoralData from '../assets/electoral_data'
import { $ } from "./util"

let d3 = Object.assign({}, d3B, d3Select, d3geo);

let width = 1260;
let height = width;


let projection = d3.geoMercator()

let path = d3.geoPath()
.projection(projection)

let percentages = []





//const files = ["TXMUNDI99019.csv","TXMUNDI99029.csv","TXMUNDI99039.csv","TXMUNDI99049.csv","TXMUNDI99059.csv","TXMUNDI99069.csv","TXMUNDI99079.csv","TXMUNDI99089.csv","TXMUNDI99099.csv","TXMUNDI99109.csv","TXMUNDI99119.csv","TXMUNDI99129.csv","TXMUNDI99139.csv","TXMUNDI99149.csv","TXMUNDI99159.csv","TXMUNDI99169.csv","TXMUNDI99179.csv","TXMUNDI99189.csv","TXMUNDI99199.csv","TXMUNDI99209.csv","TXMUNDI99219.csv","TXMUNDI99229.csv","TXMUNDI99239.csv","TXMUNDI99249.csv","TXMUNDI99259.csv","TXMUNDI99269.csv","TXMUNDI99279.csv","TXMUNDI99289.csv","TXMUNDI99299.csv","TXMUNDI99309.csv","TXMUNDI99319.csv","TXMUNDI99329.csv","TXMUNDI99339.csv","TXMUNDI99349.csv","TXMUNDI99359.csv","TXMUNDI99369.csv","TXMUNDI99379.csv","TXMUNDI99389.csv","TXMUNDI99399.csv","TXMUNDI99409.csv","TXMUNDI99419.csv","TXMUNDI99429.csv","TXMUNDI99439.csv","TXMUNDI99449.csv","TXMUNDI99459.csv","TXMUNDI99469.csv","TXMUNDI99479.csv","TXMUNDI99489.csv","TXMUNDI99499.csv","TXMUNDI99509.csv","TXMUNDI99519.csv","TXMUNDI99529.csv"]
const files = [
"TXMUNCO99019.csv",
"TXMUNCO99029.csv",
"TXMUNCO99039.csv",
"TXMUNCO99049.csv",
"TXMUNCO99059.csv",
"TXMUNCO99069.csv",
"TXMUNCO99079.csv",
"TXMUNCO99089.csv",
"TXMUNCO99099.csv",
"TXMUNCO99109.csv",
"TXMUNCO99119.csv",
"TXMUNCO99129.csv",
"TXMUNCO99139.csv",
"TXMUNCO99149.csv",
"TXMUNCO99159.csv",
"TXMUNCO99169.csv",
"TXMUNCO99179.csv",
"TXMUNCO99189.csv",
"TXMUNCO99199.csv",
"TXMUNCO99209.csv",
"TXMUNCO99219.csv",
"TXMUNCO99229.csv",
"TXMUNCO99239.csv",
"TXMUNCO99249.csv",
"TXMUNCO99259.csv",
"TXMUNCO99269.csv",
"TXMUNCO99279.csv",
"TXMUNCO99289.csv",
"TXMUNCO99299.csv",
"TXMUNCO99309.csv",
"TXMUNCO99319.csv",
"TXMUNCO99329.csv",
"TXMUNCO99339.csv",
"TXMUNCO99349.csv",
"TXMUNCO99359.csv",
"TXMUNCO99369.csv",
"TXMUNCO99379.csv",
"TXMUNCO99389.csv",
"TXMUNCO99399.csv",
"TXMUNCO99409.csv",
"TXMUNCO99419.csv",
"TXMUNCO99429.csv",
"TXMUNCO99439.csv",
"TXMUNCO99449.csv",
"TXMUNCO99459.csv",
"TXMUNCO99469.csv",
"TXMUNCO99479.csv",
"TXMUNCO99489.csv",
"TXMUNCO99499.csv",
"TXMUNCO99509.csv",
"TXMUNCO99519.csv",
"TXMUNCO99529.csv"]

let data = []

Promise.all(files
.map(file => {
	fetch('<%= path %>/assets/TXMUNCO995k3agofj/' + file).then(response =>{
		return response.ok ? response.text() : Promise.reject(response.status);
	})
	.then(text =>{

		let province = csv(text,{"delimiter": ";","rtrim": true})

		province.map(field => {

			let municipality = []

			municipality.push({
					comunidad_code:field[0],
					provincia_code:field[1],
					fixed_value_0:field[2],
					municipality_code:field[3],
					district_code:field[4],
					municipality_name:field[5],
					fixed_value_1:field[6],
					fixed_value_2:field[7],
					poll_boxes:field[8],
					census_total:field[9],
					census_counted:field[10],
					census_counted_percentage:field[11],
					voters:field[12],
					voters_percentage:field[13],
					abstention:field[14],
					abstention_percentage:field[15],
					blank_votes:field[16],
					blank_votes_percentage:field[17],
					null_votes:field[18],
					null_votes_percentage:field[19],
					results:[]
			})

			for (let i = 20; i < 340; i++) {

				if(i % 4 == 0){

					if(field[i + 1].length != 55)
					{
						municipality[0].results.push({
							party_code:field[i],
							party_acronym:field[i + 1],
							party_votes:field[i + 2],
							party_votes_percentage:field[i + 3]
						})
					}
					
				}
			}

			data.push(municipality[0])
	
		})
	})
	.then(d => {

		//console.log(data.length)

		//makeMap()

		/*if(data.length == 200)
		{
			makeMap()
		}*/


		if(data.length == 8223)
		{
			makeMap()
		}
	
	})

}))

let voxResults = []


const makeMap = empty  => {

	projection.fitSize([width, height], topojson.feature(municipalities, municipalities.objects.municipios));

	let municipiosFeatures = topojson.feature(municipalities, municipalities.objects.municipios).features

	let winnersGroup = d3.select("#elections-municipalities").append('svg')
	.attr('width', width)
	.attr('height', height)

	let winners = winnersGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	//.style('stroke', "black")
	.style('fill', "#333333")
	.style('opacity', 0)

	

	data.map(municipality =>{


		//console.log('&&', municipality)

		municipality.results.map( result => {

			let voxResult;

			let op = 0;



			if(result.party_acronym == "VOX")
				{
					voxResult = result;

					voxResults.push(voxResult);

					//console.log("@@", +voxResult.party_votes_percentage / 10000)

					let mun = d3.select('#m' + municipality.provincia_code + municipality.municipality_code)

					let pr = +voxResult.party_votes_percentage / 100;

					console.log(pr)

					if(pr > 0 && pr < 10){
						op = 0.1
					}
					else if(pr >= 10 && pr < 20){
						op = 0.3
					}
					else if(pr >= 20 && pr < 30){
						op = 0.6
					}
					else if(pr >= 30){
						op = 1
					}




					//console.log(voxResult.party_votes_percentage,+voxResult.party_votes_percentage/ 10000)

					mun
					.style('opacity', op)
					
				}

			
		})
		

	})


	let max = d3.max(voxResults, function(d) { return +d.party_votes_percentage;} );
	let maxMunicipality = voxResults.find(result => +result.party_votes_percentage >= max)
	console.log('max: ', max, maxMunicipality)
}

