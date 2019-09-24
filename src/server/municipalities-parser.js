import csvParse from 'csv-parse/lib/es5/sync'
import csvStringify from 'csv-stringify/lib/es5/sync'
import fs from "fs"
import util from "util"
import csv from 'csv-parse/lib/sync'

const files = [
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99019.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99029.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99039.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99049.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99059.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99069.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99079.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99089.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99099.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99109.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99119.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99129.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99139.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99149.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99159.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99169.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99179.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99189.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99199.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99209.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99219.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99229.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99239.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99249.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99259.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99269.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99279.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99289.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99299.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99309.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99319.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99329.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99339.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99349.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99359.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99369.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99379.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99389.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99399.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99409.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99419.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99429.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99439.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99449.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99459.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99469.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99479.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99489.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99499.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99509.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99519.csv",
"./src/assets/TXMUNCO99kojg2dng/TXMUNCO99529.csv"]

let data = []

const readFile = (fileName) => util.promisify(fs.readFile)(fileName,'utf8');

(async () => {
try {
    
    for (const file of files) {

        const provinceRaw = await readFile(file);
        const province = csvParse(provinceRaw,{"delimiter": ";","rtrim": true});


        province.map(field => {
        	let municipality = []


        	let cont = 1;

			municipality.push({
					comunidad_code:String(field[0]),
					provincia_code:String(field[1]),
					//fixed_value_0:field[2],
					municipality_code:String(field[3]),
					district_code:String(field[4]),
					municipality_name:String(field[5]),
					//fixed_value_1:field[6],
					//fixed_value_2:field[7],
					//poll_boxes:field[8],
					census_total:Number(field[9]),
					census_counted:Number(field[10]),
					census_counted_percentage:Number(field[11]) / 100,
					voters:Number(field[12]),
					voters_percentage:Number(field[13]) / 100,
					abstention:Number(field[14]),
					abstention_percentage:Number(field[15]) / 100,
					blank_votes:Number(field[16]),
					blank_votes_percentage:Number(field[17]) / 100,
					null_votes:Number(field[18]),
					null_votes_percentage:Number(field[19]) / 100
			})

			for (let i = 20; i < 340; i++) {

				if(i % 4 == 0){

					if(field[i + 1].length != 55)
					{
							municipality[0]['party_code ' + cont] = field[i];
							municipality[0]['party_acronym ' + cont] = field[i + 1];
							municipality[0]['party_votes ' + cont] = Number(field[i + 2]);
							municipality[0]['party_votes_percentage ' + cont] = Number(field[i + 3]) / 100;

							cont++
					}
					
				}
			}

			data.push(municipality[0])
       })

    }

    makeFile()
  }
  catch (error) {
    console.error(error);
  }
})();



function makeFile(){
	console.log(csvStringify(data, { header : true }))
	fs.writeFileSync('./src/assets/Resultados por municipio.csv', csvStringify(data, { header : true }));
}
