import provinceResults from 'raw-loader!./../assets/november-province-results.csv'
import oldResults from 'raw-loader!./../assets/old-province-results.csv'
import * as d3 from 'd3'

const partiesList = ["Más País","UP", "ERC", "AHORA CANARIAS","ANDECHA ASTUR","ARA-MES-ESQUERRA","AVANT ADELANTE LOS VERDES","AVANT-LOS VERDES","AxSI","BNG","C 21","CCa-PNC","centrados","C.Ex-C.R.Ex-P.R.Ex","CILU-LINARES","CNV","COMPROMÍS 2019","CpM","Cs","Cs","CxG","DP","DPL","EAJ-PNV","EB","EB","EB","ECP-GUANYEM EL CANVI","EH Bildu","ELAK/PCTE","EL PI","EN MAREA","ERC-SOBIRANISTES","ERPV","F8","FE de las JONS","FIA","FRONT REPUBLICÀ","GBAI","IZAR","IZQP","JF","JxCAT-JUNTS","+MAS+","NA+","NCa","PACMA","PACMA","PACT","PCOE","PCPA","PCPC","PCPC","PCPE","PCPE","PCTC","PCTE","PCTE/ELAK","PCTG","PDSJE-UDEC","PH","P-LIB","PODEMOS-EUIB","PODEMOS-EU-MAREAS EN COMÚN-EQUO","PODEMOS-EUPV","PODEMOS-IU-EQUO","PODEMOS-IU-EQUO-AAeC","PODEMOS-IU-EQUO-BATZARRE","PODEMOS-IU-EQUO BERDEAK","PODEMOS-IU LV CA-EQUO","PODEMOS-IX-EQUO","PP","PP","PP","PP-FORO","PPSO","PR+","PRC","PREPAL","PSC","PSdeG-PSOE","PSE-EE (PSOE)","PSOE","PSOE","PUM+J","PUM+J","PUM+J","PYLN","RECORTES CERO-GV","RECORTES CERO-GV-PCAS-TC","RISA","SOLIDARIA","SOMOS REGIÓN","UDT","UIG-SOM-CUIDES","UNIÓN REGIONALISTA","VOU","VOX", "CAnda", "PODEMOS-IU-Alto Aragón en Común", "CHA", "¡TERUEL EXISTE!", "AUNACV", "ANDECHA", "PODEMOS-IX", "MÉS-ESQUERRA", "CCa-PNC-NC", "VERDES", "CONTIGO", "PDSJE","VERDES o LOS VERDES o LV","PCAS-TC","XAV","UPL","PFyV","Junts","PFiV","CUP-PR","I.Fem","UNIDOS SÍ-ACPS-DEf","EXTREMADURA UNIDA","MÉS COMPROMÍS","RVPVE","MDyC"];
const podemosRawNames = ["PODEMOS-IULV-CA", "PODEMOS-EU","PODEMOS-IU","PODEMOS-EUIB","PODEMOS-EU-MAREAS EN COMÚN-EQUO","PODEMOS-EUPV","PODEMOS-IU-EQUO","PODEMOS-IU-EQUO-AAeC","PODEMOS-IU-EQUO-BATZARRE","PODEMOS-IU-EQUO BERDEAK","PODEMOS-IU LV CA-EQUO","PODEMOS-IX-EQUO","ECP-GUANYEM EL CANVI"];
const psoeRawNames = ["PSC-PSOE","PSC","PSdeG-PSOE","PSE-EE (PSOE)","PSOE","PSOE"];
const csRawNames = ["C's","Cs","Citizens"];
const ppRawNames = ["PP","PP-FORO"];
const juntsRawNames = ["JUNTS","JxCAT-JUNTS"];
const ercRawNames = ["ERC-SOBIRANISTES","ERC-CATSÍ","ERC"];
const masPaisRawNames = ['MAS','MÁS PAÍS','M. PAÍS','MÁS','MÁS PAÍS-ANDALUCÍA','MÁS PAÍS-CANDIDATURA ECOLOGISTA','MÁS PAÍS-EQUO','MÁS PAÍS-EQUO','M.PAÍS-CHA-EQUO'];
const PNCRawNames = ['CCa-PNC-NC','NC-CCa-PNC'];


const seats = 350;
const majority = seats / 2;

const totalProvinceVotes = d3.csvParse(provinceResults);
const totalProvinceVotesOld = d3.csvParse(oldResults);
const partyWing = [];
const totalPartiesLastElections = 13;

let isMobile = window.matchMedia('(max-width: 620px)').matches;
let ranks = isMobile ? 14 : 7;

let totalCounted = 0;

partyWing["Más País"]="left";partyWing["UP"]="left";partyWing["ERC"]="left";partyWing["AHORA CANARIAS"]="left";partyWing["ANDECHA ASTUR"]="left";partyWing["ARA-MES-ESQUERRA"]="left";partyWing["AVANT ADELANTE LOS VERDES"]="left";partyWing["AVANT-LOS VERDES"]="left";partyWing["AxSI"]="left";partyWing["BNG"]="left";partyWing["C 21"]="left";partyWing["CCa-PNC"]="left";partyWing["centrados"]="left";partyWing["C.Ex-C.R.Ex-P.R.Ex"]="left";partyWing["CILU-LINARES"]="left";partyWing["CNV"]="left";partyWing["COMPROMÍS 2019"]="left";partyWing["CpM"]="left";partyWing["Cs"]="right";partyWing["Cs"]="right";partyWing["CxG"]="left";partyWing["DP"]="left";partyWing["DPL"]="";partyWing["EAJ-PNV"]="right";partyWing["EB"]="left";partyWing["EB"]="left";partyWing["EB"]="left";partyWing["ECP-GUANYEM EL CANVI"]="left";partyWing["EH Bildu"]="left";partyWing["ELAK/PCTE"]="left";partyWing["EL PI"]="left";partyWing["EN MAREA"]="left";partyWing["ERC-SOBIRANISTES"]="left";partyWing["ERPV"]="left";partyWing["F8"]="left";partyWing["FE de las JONS"]="right";partyWing["FIA"]="left";partyWing["FRONT REPUBLICÀ"]="left";partyWing["GBAI"]="left";partyWing["IZAR"]="left";partyWing["IZQP"]="left";partyWing["JF"]="left";partyWing["JxCAT-JUNTS"]="right";partyWing["+MAS+"]="left";partyWing["NA+"]="right";partyWing["NCa"]="left";partyWing["PACMA"]="left";partyWing["PACMA"]="left";partyWing["PACT"]="left";partyWing["PCOE"]="left";partyWing["PCPA"]="left";partyWing["PCPC"]="left";partyWing["PCPC"]="left";partyWing["PCPE"]="left";partyWing["PCPE"]="left";partyWing["PCTC"]="left";partyWing["PCTE"]="left";partyWing["PCTE/ELAK"]="left";partyWing["PCTG"]="left";partyWing["PDSJE-UDEC"]="left";partyWing["PH"]="left";partyWing["P-LIB"]="left";partyWing["PODEMOS-EUIB"]="left";partyWing["PODEMOS-EU-MAREAS EN COMÚN-EQUO"]="left";partyWing["PODEMOS-EUPV"]="left";partyWing["PODEMOS-IU-EQUO"]="left";partyWing["PODEMOS-IU-EQUO-AAeC"]="left";partyWing["PODEMOS-IU-EQUO-BATZARRE"]="left";partyWing["PODEMOS-IU-EQUO BERDEAK"]="left";partyWing["PODEMOS-IU LV CA-EQUO"]="left";partyWing["PODEMOS-IX-EQUO"]="left";partyWing["PP"]="right";partyWing["PP"]="right";partyWing["PP"]="right";partyWing["PP-FORO"]="right";partyWing["PPSO"]="";partyWing["PR+"]="left";partyWing["PRC"]="left";partyWing["PREPAL"]="left";partyWing["PSC"]="left";partyWing["PSdeG-PSOE"]="left";partyWing["PSE-EE (PSOE)"]="left";partyWing["PSOE"]="left";partyWing["PSOE"]="left";partyWing["PUM+J"]="left";partyWing["PUM+J"]="left";partyWing["PUM+J"]="left";partyWing["PYLN"]="left";partyWing["RECORTES CERO-GV"]="left";partyWing["RECORTES CERO-GV-PCAS-TC"]="left";partyWing["RISA"]="left";partyWing["SOLIDARIA"]="left";partyWing["SOMOS REGIÓN"]="left";partyWing["UDT"]="left";partyWing["UIG-SOM-CUIDES"]="left";partyWing["UNIÓN REGIONALISTA"]="left";partyWing["VOU"]="left";partyWing["VOX"]="right";

let totalSeatsByParty = [];
let partiesWithSeats = [];
let partiesRaw = [];

let containerWidth = Number(d3.select(".gv-waffle").style('width').slice(0, -2));

let files = seats / ranks;
let cellsize = containerWidth / files;

let containerHeight =  (cellsize * ranks);

let waffle = d3.select(".gv-waffle")

let svg = waffle.append("svg")
.attr("width", containerWidth)
.attr("height",containerHeight)

let fourParties;
let partyarray = [];
let left = [];
let right = [];

let totalNodata = {party: "nodata", seats: seats};

let assignedSeats = 0;

let newPartiesList = [];

partiesList.map(party => totalSeatsByParty[party] = [])

totalProvinceVotes.map( (province,n) => {

    if(province.territory_id == 'TO') totalCounted = +province.census_counted_percentage / 100;

    d3.select('.gv-main-title span').html(totalCounted + '% of votes counted')

    let oldProvince = totalProvinceVotesOld.find(p => p.id === province.province_code);
   
    if(+province.census_counted > 0)
    {
        if(oldProvince)
        {
                for(let i = 1 ; i<80 ; i++)
                {
                        
                        let party = province['party ' + i];
                        let oldSeats = 0;
                        let oldVotes = 0;
                        let wing = '';

                        if(podemosRawNames.indexOf(party) != -1) party = 'UP';
                        if(psoeRawNames.indexOf(party) != -1) party = 'PSOE';
                        if(ercRawNames.indexOf(party) != -1) party = 'ERC';
                        if(ppRawNames.indexOf(party) != -1) party = 'PP';
                        if(csRawNames.indexOf(party) != -1) party = 'Cs';
                        if(juntsRawNames.indexOf(party) != -1) party = 'Junts';
                        if(masPaisRawNames.indexOf(party) != -1) party = 'Más País';
                        if(PNCRawNames.indexOf(party) != -1) party = 'CCa-PNC-NC';

                        if(partyWing[party])wing =  partyWing[party];

                        for (var j = 1; j <= totalPartiesLastElections; j++) {
                            if(oldProvince['party ' + j] ==  party){
                                oldSeats = oldProvince['seats ' + j]; //CAUTION old and new party names must match. I have tweaked April's csv results sheet to match but we need to double check this as soos as new parties come across
                                oldVotes = oldProvince['votes ' + j]; //CAUTION old and new party names must match
                            }
                        }

                        if(partiesList.indexOf(party) == -1){

                            console.log("This is a new party: ",party)
                            
                            partiesList.push(party);
                            newPartiesList.push(party);
                            totalSeatsByParty[party] = [];
                            partyWing[party] = "right";
                        }


                        if(partiesList.indexOf(party) != -1 && +province['seats ' + i] > 0){

                            totalSeatsByParty[party].push(
                            {
                                province: province.province_name,
                                seats: +province['seats ' + i],
                                old_seats: +oldSeats,
                                votes: +province['votes ' + i],
                                old_votes: +oldVotes,
                                percentage: +province['percentage ' + i],
                                wing:wing

                            });

                            if(+province['seats ' + i] > 0 && partiesRaw.indexOf(party) == -1)
                            {
                                partiesWithSeats.push({party:party, seats:0});
                                partiesRaw.push(party)
                            }
                        }
                    
            }


            for (var i = 1; i <= totalPartiesLastElections; i++) {
                if(oldProvince['seats ' + i] > 0){

                    let match = totalSeatsByParty[oldProvince['party ' + i]].find(province => oldProvince.province == province.province);

                    if(!match){

                        totalSeatsByParty[oldProvince['party ' + i]].push(
                            {
                                province:  oldProvince.province,
                                seats: 0,
                                old_seats: +oldProvince['seats ' + i],
                                votes: 0,
                                old_votes: +oldProvince['votes ' + i],
                                percentage: 0,
                                wing:partyWing[oldProvince['party ' + i]]
                            }
                        )
                    }
                }
            }
        }
    }
    else{
        console.log(province.province_name, " hasn't yet started to count")
    }
})

partiesWithSeats.map(party => {

    let t = 0;

    totalSeatsByParty[party.party].map(seats => {

        t += seats.seats

        assignedSeats += seats.seats;
    })

    party.seats = t;
})

partiesWithSeats.sort((a,b) => +b.seats - +a.seats);

fourParties = partiesWithSeats.slice(0,4);

flagMainParties();
addKey();

totalNodata.seats = seats - assignedSeats;

if(seats - assignedSeats < 0) totalNodata.seats = 0;

partiesWithSeats.map(party => {
    if(partyWing[party.party] == 'left') left.push(party)
    else right.push(party)
})

if(right.length > 0)
{
    partiesWithSeats = [];

    if(left[0].seats > right[0].seats){
        right.reverse();

        partiesWithSeats = left.concat(totalNodata).concat(right);

    }
    else
    {
        left.reverse()

        partiesWithSeats = right.concat(totalNodata).concat(left)
    }
}

partiesWithSeats.map(party => {
    let parray = Array(Number(party.seats)).fill(party);
    partyarray.push(...parray);
    
})

let partyIniArray = [];

for (let i = 0; i < seats; i++) {
    partyIniArray.push(i)
}

let partyblobsIni = svg.append("g").selectAll("rect")
.data(partyIniArray)
.enter()
.append('rect')
.attr("id", (d, i) => { return i })
.attr("height", cellsize)
.attr("width", cellsize)
.attr("x", (d, i) => {
    return cellsize * Math.floor(i / ranks)
})
.attr("y", (d, i) => {
    return i * cellsize - (Math.floor(i / ranks) * cellsize * ranks)
})
.attr('class','deputy')

let partyblobs = svg.append("g").selectAll("rect")
.data(partyarray)
.enter()
.append('rect')
.attr("id", (d, i) => { return i })
.attr("height", cellsize)
.attr("width", cellsize)
.attr("x", (d, i) => {
    return cellsize * Math.floor(i / ranks)
})
.attr("y", (d, i) => {
    return i * cellsize - (Math.floor(i / ranks) * cellsize * ranks)
})
.attr('class', d => d.party)

newPartiesList.map(party =>{


    let randomColor = Math.floor(Math.random()*16777215).toString(16);

    d3.select('[class="' + party + '"').style('background-color','#'+ randomColor)

    d3.selectAll('.gv-waffle [class="' + party + '"').style('fill', '#' + randomColor)

    d3.selectAll('.cartogram [class="' + party + '"').style('fill', '#' + randomColor)

    d3.selectAll('.provinces [class="' + party + '"').style('fill', '#' + randomColor)


})

let midlineText = svg.append('g')
.append('text')


let midline = svg.append('g')
.attr('width', 200)
.attr('height', containerHeight )
.attr('transform', d =>{
    let translateMobile = 'translate('+ ((containerWidth /2) + (cellsize / 2)) +', 0)';
    let translateDesktop = 'translate('+ (containerWidth /2) +', 0)';
    let translate;

    isMobile ? translate = translateMobile : translate = translateDesktop;

    return translate
});

let path = midline
.append('path')
//.attr('d', "M 0 0 V 0 L 0 " +  (cellsize * (ranks / 2)) + "H " + (-cellsize) + " V " + (cellsize * (ranks / 2)) + "L " + (-cellsize) + " " +  (cellsize * ranks) ) 
.attr('d', d => {

    let lineMobile = "M 0 0 V 0 L 0 " +  (cellsize * (ranks / 2)) + "H " + (-cellsize) + " V " + (cellsize * (ranks / 2)) + "L " + (-cellsize) + " " +  (cellsize * ranks);
    let lineDesktop = "M 0 0 V 0 L 0 " +  (cellsize * ranks);
    let line;

    isMobile ? line = lineMobile : line = lineDesktop;

    return line

}) 
.attr('class', 'gv-midline')




function addKey() {
    let gvkeystring = '';
    let keydiv = document.querySelector(".gv-key")

    partiesWithSeats.sort((a,b) => +b.seats - +a.seats)

    console.log(partiesWithSeats)

    partiesWithSeats.map(p => {


        let name = p.party;

        let current = totalSeatsByParty[name].reduce((a, b) => { return a + b.seats; }, 0);
        let old = totalSeatsByParty[name].reduce((a, b) => { return a + b.old_seats; }, 0);
        let difference = current - old

        if(difference > 0) difference = '+' + difference;

        if(p.party != 'nodata' && p.seats >0)
        {
            if(fourParties.indexOf(p) == -1)
            {
                let partystring = `<div class="gv-party-key-entry"><div class="${name}"></div><span>${+p.seats} ${"(" + difference + ")"} ${p.party}</span></div>`;
                gvkeystring += partystring;
            }
        }
    })


    keydiv.innerHTML = gvkeystring;
}

function flagMainParties () {

    fourParties.map((party,i) => {

        if(party.seats > 0)
        {

            let name = party.party;

            let current = totalSeatsByParty[name].reduce((a, b) => { return a + b.seats; }, 0);
            let old = totalSeatsByParty[name].reduce((a, b) => { return a + b.old_seats; }, 0);
            let difference = current - old

            if(difference > 0) difference = '+' + difference;
            
            document.querySelector('.gv-main-party-' + (i+1) + '-name').innerHTML = name;
            document.querySelector('.gv-main-party-' + (i+1) + '-seats').innerHTML = party.seats + " (" + difference + ")";
            document.querySelector('.gv-party-box-' + (i+1) ).className = name;
        } 
    })
}


window.addEventListener("resize", function(){

    isMobile = window.matchMedia('(max-width: 620px)').matches;
    containerWidth = Number(d3.select(".gv-waffle").style('width').slice(0, -2));
    ranks = isMobile ? 14 : 7;
    containerHeight = cellsize * ranks;

    files = seats / ranks;

    cellsize = containerWidth / files;

    svg
    .attr("width", containerWidth)
    .attr("height", containerHeight)

    partyblobsIni
    .attr("x", (d, i) => {
        return cellsize * Math.floor(i / ranks)
    })
    .attr("y", (d, i) => {
        return i * cellsize - (Math.floor(i / ranks) * cellsize * ranks)
    })
    .attr("height", cellsize)
    .attr("width", cellsize)

    partyblobs
    .attr("x", (d, i) => {
        return cellsize * Math.floor(i / ranks)
    })
    .attr("y", (d, i) => {
        return i * cellsize - (Math.floor(i / ranks) * cellsize * ranks)
    })
    .attr("height", cellsize)
    .attr("width", cellsize)

    isMobile ? midline.attr('transform', 'translate('+ ((containerWidth /2) + (cellsize / 2)) +', 0)') :  midline.attr('transform', 'translate('+ (containerWidth /2) +', 0)');

    isMobile ? path.attr('d', "M 0 0 V 0 L 0 " +  (cellsize * (ranks / 2)) + "H " + (-cellsize) + " V " + (cellsize * (ranks / 2)) + "L " + (-cellsize) + " " +  (cellsize * ranks) ) : path.attr('d', "M 0 0 V 0 L 0 " +  (cellsize * ranks) )
     

});

