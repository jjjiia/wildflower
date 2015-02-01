var config = {
	timer:null
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
       '.5': '#fff',
       '.8': '#aaa',
       '.95': '#000'
     },
	 maxOpacity: 1,
	 minOpacity: 1
  });

function drawTimeline(data){
	
}
//draw timeline range
//draw handles
//set handles to inital interval
//animate 

function dataDidLoad(error,data1,data2,data3,data4) {
	//make new data object and add different files(paths) to it
	$("#timeline-controls .stop").hide()
	
	var allInterval = data1.values.length
	var allData = {}
	allData = formatData(data1,allData,allInterval)
	 heatmapInstance.setData(allData[1]);
	
	
	
	var newData = {}
	var interval = 50
	data =formatData(data1,newData,interval)
	data =formatData(data2,newData,interval)
	data =formatData(data3,newData,interval)
	data =formatData(data4,newData,interval)
	animate(data)
}

function filterDataAndAnimate(data,start,end){
	
}

function formatData(data, newData,interval){
	var interval = interval
	var frame = 0
		
	jQuery.each(data.values,function(i,d){
		d["min"] = 0
		d["max"] = 100
		if(newData[frame] == undefined){
			newData[frame]={}
			newData[frame]["data"] = []
			newData[frame]["data"].push({"x":d.x, "y":d.y, "max":10,"min":0})
		}else{
			newData[frame]["data"].push({"x":d.x, "y":d.y,"max":10,"min":0})
		}
		if(i%interval == 0){
			frame +=1
		}
		d["data"] = [{"x":d.x, "y":d.y,"value":d.value}]
		//console.log(d)
	})
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
			 
		 }, 200);
		 
		 if(i == size){
			 timelineControlStop
		 }
  $("#timeline-controls .stop").click(timelineControlStop)
})
}
