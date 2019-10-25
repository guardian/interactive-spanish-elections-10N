import csvParse from 'csv-parse/lib/es5/sync'
import csvStringify from 'csv-stringify/lib/es5/sync'
import fs from "fs"

const provincesVotesRaw = fs.readFileSync("./src/assets/latestraw.csv")

const provinces = csvParse(provincesVotesRaw,{"delimiter": ";","rtrim": true});

const provincesTotals = [];
const totals = [];

provinces.map(field => {


	if(field[0] == 'CI' || field[0] == 'TO')
	{

		let province = []

			let cont = 1;

			province.push({
					territory_id:field[0],
					comunidad_code:field[1],
					province_code:field[2],
					province_name:field[4],
					poll_boxes:field[5],
					census_total:field[6],
					census_counted:field[7],
					census_counted_percentage:field[8],
					voters:field[9],
					voters_percentage:field[10],
					abstention:field[11],
					abstention_percentage:field[12],
					blank_votes:field[13],
					blank_votes_percentage:field[14],
					null_votes:field[15],
					null_votes_percentage:field[16],
					deputies_total:field[17]

			})

			for (let i = 18; i < field.length-1; i++) {

					if((i-18)%5 == 0)
					{

						province[0][ 'code ' + cont] = field[i];
						province[0][ 'party ' + cont] = field[i + 1];
						province[0][ 'votes ' + cont] = field[i + 2];
						province[0][ 'percentage ' + cont] = field[i + 3];
						province[0][ 'seats ' + cont] = field[i + 4];

						cont++

					}
			}

			provincesTotals.push(province[0])

	}
	/*if(field[0] == 'TO')
	{

		totals.push({

					territory_id:field[0],
					comunidad_code:field[1],
					province_code:field[2],
					province_name:field[4],
					poll_boxes:field[5],
					census_total:field[6],
					census_counted:field[7],
					census_counted_percentage:field[8],
					voters:field[9],
					voters_percentage:field[10],
					abstention:field[11],
					abstention_percentage:field[12],
					blank_votes:field[13],
					blank_votes_percentage:field[14],
					null_votes:field[15],
					null_votes_percentage:field[16],
					deputies_total:field[17]

			})

		for (let i = 18; i < field.length-1; i++) {

			if(field[i + 4] > 0)
			{
				if((i-18)%5 == 0)
				{

					totals.push({code: field[i], party: field[i+1], votes: +field[i+2], percentage: +field[i+3]/100, seats: +field[i+4]})

				}
			}

		}
	}*/


	
	

			
})


fs.writeFileSync('./src/assets/april-province-results.csv', csvStringify(provincesTotals, { header : true }));
//fs.writeFileSync('./src/assets/april-total-results.csv', csvStringify(totals, { header : true }));
