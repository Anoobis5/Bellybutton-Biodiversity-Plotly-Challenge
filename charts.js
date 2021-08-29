function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//Deliverables 1-3

// Bar, Bubble, and Guage charts

// Creates the buildCharts function.
function buildCharts(sample) {

  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultsArray = samples.filter(sampleObj => sampleObj.id == sample);
    var results = resultsArray[0];
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var metadata = metadataArray[0];
    var freqs = parseFloat(metadata.wfreq)
    var ids = results.otu_ids;
    var labels = results.otu_labels;
    var values = results.sample_values;

    var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(); 
    console.log(yticks);
    
    var barData = [
      {
        y: yticks,
        x: values.slice(0, 10).reverse(),
        text:  labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      margin: {l: 75, r: 75, t: 75, b: 75},
      paper_bgcolor: "#000000",
      blendMode:'screen',
      font: { color: "#ffffff", family: "Serif" },
    };

    Plotly.newPlot("bar", barData, barLayout); 

// Create a Bubble Chart

    // Create the trace for the bubble chart.
    var bubbleData = [
        {
        x:ids,
        y:values,
        text:labels,
        mode: "markers",
        marker: {
          size: values,
          color: ids,
          colorscale: "Earth"
        }
      }
    ];

    var data = [bubbleData];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"<b>Bacteria Culture Per Sample</b>",
    
    showlegend: false,
    automargin: true,
    paper_bgcolor: "#000000",
    blendMode:'screen',
    font: { color: "#ffffff", family: "Serif" },
    height: 600,
    width: 1200,
    xaxis: {title: "OTU ID"},
  };

  var config = {
    responsive: true,
  };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);



// Create a Gauge Chart
console.log(data.metadata);

  var gaugeData = [{
    value: freqs,
    type: "indicator",
    mode: "gauge+number",
    title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
    gauge: {
      axis: {range: [null,10], dtick: "2"},
        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2
      }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
    automargin: true,
    width: 450,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    line: {
    color: '600000'
    },
    paper_bgcolor: "#000000",
    blendMode:'screen',
    font: { color: "#ffffff", family: "Serif" }
  };
  

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}