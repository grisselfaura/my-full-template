// var yearGlobalChart   = new dc.pieChart("chart-global-CO2-year"),
//     countryChart  = new dc.barChart("#chart-country-CO2-year"),
//     topCountryMap = new dc.rowChart("#map-top-countries");
var emissionsData = new Array;
var emissionYears = new Object;

queue() 
    .defer(d3.csv, "data/global-carbon-dioxide-emissions-by-sector.csv")
    .await(makeGraphs);
    
function makeGraphs(error, emissionSectorData){ /*replace*/ 
    var ndx = crossfilter(emissionSectorData); /*replace*/ 

    emissionSectorData.forEach(function(d){
        // d.year = parseInt(d.Year);
        // d.Transport = parseFloat(d.Transport);
        // d.Forestry = parseInt(d.Forestry);
        // d.Energy = parseInt(d.Energy);
        // d.Other_sources = parseInt(d["Other sources"]);
        // d.Agriculture_Land_Use_Forestry = parseInt(d["Agriculture, Land Use and Forestry"]); 
        // d.Waste = parseInt(d.Waste);
        // d.Residential_commercial = parseInt(d["Residential and commercial"]);
        // d.Industry = parseInt(d.Industry);
        // d.Agriculture = parseInt(d.Agriculture);
        
        var emissionRow = new Object;
      
        emissionRow.Entity = d.Entity;
        emissionRow.Year =  parseFloat(d.Year);
        emissionRow.Transport = parseFloat(d.Transport);
        emissionRow.Forestry = parseFloat(d.Forestry);
        emissionRow.Energy = parseFloat(d.Energy);
        emissionRow.Other_sources = parseFloat(d["Other sources"]);
        emissionRow.Agriculture_Land_Use_Forestry = parseFloat(d["Agriculture, Land Use and Forestry"]); 
        emissionRow.Waste = parseFloat(d.Waste);
        emissionRow.Residential_commercial = parseFloat(d["Residential and commercial"]);
        emissionRow.Industry = parseFloat(d.Industry);
        emissionRow.Agriculture = parseFloat(d.Agriculture);

        for (key in emissionRow) { // REMOVE NAN VALUES
            if (isNaN(emissionRow[key])) {
                 emissionRow[key] = 0
            }
        }

        emissionsData.push(emissionRow);
    });

    function totalYearValues() {
        for (i = 0; i < emissionsData.length; i++)
        {
            var totalCO = 0.0;
            totalCO += parseFloat(emissionsData[i].Transport);
            totalCO += parseFloat(emissionsData[i].Forestry);
            totalCO += parseFloat(emissionsData[i].Energy);
            totalCO += parseFloat(emissionsData[i].Other_sources);
            totalCO += parseFloat(emissionsData[i].Agriculture_Land_Use_Forestry);
            totalCO += parseFloat(emissionsData[i].Waste);
            totalCO += parseFloat(emissionsData[i].Industry);
            totalCO += parseFloat(emissionsData[i].Agriculture);

            var year = emissionsData[i].Year;

            if (totalCO == NaN) {
                console.log((emissionsData[i]));
            }
            else {
                if (totalCO != null) {

                    if (year in emissionYears){
                        var addingTotalYear = parseFloat(emissionYears[year]) + parseFloat(totalCO)

                        if (totalCO != NaN) {
                            emissionYears[year] = parseFloat(emissionYears[year]) + parseFloat(totalCO)
                        }
                        else {
                        }
                    } 
                    else {
                        emissionYears[year] = parseFloat(totalCO);
                    }
                }        
            }
        }
    }
    
    show_global_emissions_per_year(ndx);
    show_country_selector(ndx); //function takes the ndx crossfilter as its only argument
    show_country_emissions_top_sectors(ndx);
    totalYearValues();
    dc.renderAll();
}

    
function show_country_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Entity'));
    var group = dim.group();
    
    dc.selectMenu("#country-selector")
        .dimension(dim)
        .group(group) 
        .title(kv => kv.key);/*not showing the count numner*/
}

function show_global_emissions_per_year(ndx) {
    var year_dim = ndx.dimension(dc.pluck('year'));
    var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('totalCO'));
    //var yearGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('totalSectorSum'));
    
    /*for chart scale*/
    var minYear = year_dim.bottom(1)[0].Year;
    var maxYear = year_dim.top(1)[0].Year;

    dc.lineChart("#chart-global-CO2-year")
            .width(1000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left:100})
            .dimension(year_dim)
            .group(yearGlobalEmissionsChart)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .y(d3.scale.linear())//check scale and x axus
            //.y(d3.scale.linear().domain([0, d3.max(emissionSectorData)]).range([0, h]))//check scale and x axus
            //.elasticX(true) 
            .elasticY(true)
            .xAxisLabel("Years")
            .yAxisLabel("Total CO2 emissions")
            .yAxis().ticks(20);             
}

function show_global_emissions_per_sector(ndx) {
    var year_dim = ndx.dimension(dc.pluck('Year'));
    var sectorGlobalEmissionsChart = year_dim.group().reduceSum(dc.pluck('Transport'));
    
}

function show_country_emissions_top_sectors(ndx) {
    var Entity_dim = ndx.dimension(dc.pluck('Entity'));/*replace by */ 
    var total_emissions_per_sector = Entity_dim.group().reduceSum(dc.pluck('Transport'));/*replace by country and sector*/ 



    dc.pieChart("#emissions-per-sector") /*replace by name of div this needs TO BE CHANGED TO SHOW TOP5 INDUSTIRES PER COUNTRY*/ 
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(Entity_dim) /*replace */ 
        .group(total_emissions_per_sector); /*replace by:  total_emissions_per_sector */ 
}
