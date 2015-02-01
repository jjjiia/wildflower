var config = {
	timeline:{
		timer:null,
		width:1000,
		margin:20,
		xScale:d3.scale.linear().domain([0,180]).range([20,980])
	}
}
var global = {
	data:null
}

$(function() {
	queue()
	.defer(d3.json, "data/heatmap_testdata.json")
	.defer(d3.json, "data/heatmap_testdata2.json")
	.defer(d3.json, "data/heatmap_testdata3.json")
	.defer(d3.json, "data/heatmap_testdata4.json")
	
	.await(dataDidLoad);
})

var heatmapInstance = h337.create({
    container: document.getElementById('heatMap'),
	backgroundColor: '#fff',
    gradient: {
       // enter n keys between 0 and 1 here
       // for gradient color customization
       '.2': '#eee',
       '.95': '#aaa',
       '1': '#000'
     },
	 maxOpacity: .9,
	 minOpacity: .1
  });

function dataDidLoad(error,data1,data2,data3,data4) {
	//make new data object and add different files(paths) to it
	$("#timeline-controls .stop").hide()

	var allInterval = data1.values.length-1
	var allData = {}
	allInOneInterval = formatData(data1,allData,data1.values.length-1)
	allInOneInterval = formatData(data2,allData,data2.values.length-1)
	allInOneInterval = formatData(data3,allData,data3.values.length-1)
	
	//console.log(allData)
	heatmapInstance.setData(allInOneInterval[0]);


	var newData = {}
	var interval = 1000
	var start = 0
	var end = 1800
		data =formatData(data1,newData,interval)
		data =formatData(data2,newData,interval)
		data =formatData(data3,newData,interval)
	//data =formatData(data4,newData,interval)
	animate(data)
}


var utils = {
range: function(start, end) {
	var data = []

	for (var i = start; i < end; i++) {
		data.push(i)
	}

	return data
}
}

var table = {
	group: function(rows, fields) {
		var view = {}
		var pointer = null

		for(var i in rows) {
			var row = rows[i]

			pointer = view
			for(var j = 0; j < fields.length; j++) {
				var field = fields[j]

				if(!pointer[row[field]]) {
					if(j == fields.length - 1) {
						pointer[row[field]] = []
					} else {
						pointer[row[field]] = {}
					}
				}

				pointer = pointer[row[field]]
			}

			pointer.push(row)
		}

		return view
	},

	filter: function(view, callback) {
		var data = []

		for(var i in view) {
			var list = view[i]
			if(callback(list, i)) {
				data = data.concat(list)
			}
		}

		return data
	}
}


function formatData(data, newData,interval){
	var interval = interval
	var totalLength = data.values.length
	//console.log(totalLength)
	var data = table.group(data.values,["frame"])
	//console.log(data)
	for(var frame = 0; frame + interval < totalLength; frame++){
		
		if(newData[frame]==undefined){
			newData[frame] = {}
			newData[frame]["data"]=[]
			//console.log(newData)
			var existingCoordinates = []
			for(var i =1; i < interval; i++){
				var currentFrame = parseInt(frame)+i
				//console.log(data[20])
				var x = data[currentFrame][0].x
				var y = data[currentFrame][0].y
				
				newData[frame]["data"].push({"x":x, "y":y})
			}
		}else{
			for(var i =1; i < interval; i++){
				var currentFrame = parseInt(frame)+i
				//console.log(data[20])
				var x = data[currentFrame][0].x
				var y = data[currentFrame][0].y
				newData[frame]["data"].push({"x":x, "y":y})
			}
		}
	}
	//console.log(newData)
//	jQuery.each(data,function(i,d){
//			d["min"] = 0
//			d["max"] = 100
//			if(newData[frame] == undefined){
//				newData[frame]={}
//				newData[frame]["data"] = []
//				newData[frame]["data"].push({"x":d.x, "y":d.y, "max":10,"min":0})
//			}else{
//				newData[frame]["data"].push({"x":d.x, "y":d.y,"max":10,"min":0})
//			}
//			
//			if(i%interval == 0){
//				frame +=1
//			}
//			
//			d["data"] = [{"x":d.x, "y":d.y,"value":d.value}]
//			//console.log(d)
//	
//	})
//	console.log(newData)
	return newData
}

function objectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var i = 0

function timelineControlStop() {
	$("#timeline-controls .play").show()
	$("#timeline-controls .stop").hide()
	clearInterval(config.timer)
}

function animate(data) {
	var size = objectSize(data);
	$("#timeline-controls .play").click(function() {
		$("#timeline-controls .play").hide()
		$("#timeline-controls .stop").show()
		config.timer = setInterval(function(){
			 i +=1
			 heatmapInstance.setData(data[i]);
			 if(i==size-1){
			 	console.log("stop")
				 timelineControlStop()
			 }
			 
		 }, 3);
		 
		 if(i == size){
			 timelineControlStop
		 }
  $("#timeline-controls .stop").click(timelineControlStop)
})
}
