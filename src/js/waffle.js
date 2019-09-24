//https://interactive.guim.co.uk/docsdata-test/11_Yp1yHl8xlIl0GMALvr0TXdNj8917Ei7lO0t-3PWZA.json

import * as d3 from 'd3'

function getFurniture(data) {
    var furniture = data.sheets.furniture;
    furniture.map(f => {
        if (document.querySelector(f.element) !== null) {
            var el = document.querySelector(f.element)
            el.innerHTML = f.text;
        }
    })
}

function addKey(data) {
    var parties = data.sheets.results;
    var gvkeystring = '';
    var keydiv = document.querySelector(".gv-key")

    parties.map(p => {
        var partystring = `<div class="gv-party-key-entry"><div class="gv-blob ${p.party}" style="--gv-colour: ${p.colour}"></div>${p.seats} ${p.party}</div>`;
        gvkeystring += partystring
    })
    keydiv.innerHTML = gvkeystring;
}

function flagMainParties (data) {
    var mainparties = data.sheets.results.filter(p => p.special != null && p.special.length > 0);
    mainparties.map(p => {
        //console.log(p)
        if (document.querySelector(p.special) !== null) {
            //console.log(p);
            var el = document.querySelector(p.special);
            //console.log(el)
            var partystring = `<span class="gv-main-party-label">${p.party}<span> <span class="gv-main-party-votes">${p.seats}</span>`
            el.innerHTML = partystring;
        }
    })
}

d3.json("https://interactive.guim.co.uk/docsdata-test/11_Yp1yHl8xlIl0GMALvr0TXdNj8917Ei7lO0t-3PWZA.json").then(data => {

    var containerWidth = Number(d3.select(".interactive-wrapper").style('width').slice(0, -2))

    var setup = data.sheets.setup[0]

    console.log(data)
    //    var cellsize = Number(setup.cellsize);
    var seats = Number(setup.totalseats);
    var ranks = Number(setup.ranks);
    var files = seats / ranks;

    var cellsize = containerWidth / files;

    var blobs = Array(seats).fill("seat");

    var waffle = d3.select(".gv-waffle")

    var svg = waffle.append("svg").attr("width", containerWidth).attr("height", cellsize * ranks)

    var results = data.sheets.results;
    var partyarray = []
    results.map(p => {
        var parray = Array(Number(p.seats)).fill(p);
        partyarray.push(...parray);
    })

    var partyblobs = svg.append("g").selectAll("pblob")
        .data(partyarray)
        .enter()
        .append('rect')
        .attr("id", (d, i) => { return i })
        .attr("x", (d, i) => {
            return cellsize * Math.floor(i / ranks)
        })
        .attr("y", (d, i) => {
            return i * cellsize - (Math.floor(i / ranks) * cellsize * ranks)
        })
        .attr("fill", d => d.colour)
        .attr("height", cellsize - 2)
        .attr("width", cellsize - 2)

    getFurniture(data);
    addKey(data);
    flagMainParties(data);

    //window.resize()

})