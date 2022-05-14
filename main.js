Status = "";
objects = [];

function preload(){

}

function setup(){
    canvas = createCanvas(480, 380);
    canvas.center();

    video = createCapture(VIDEO);
    video.hide();
}

function start(){
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detetcting Objects...";
    object_name = document.getElementById("object_name").value;
}

function modelLoaded(){
    console.log("Model Loaded!");
    Status = true;
}

function gotResult(error, result){
    if(error){
        console.log(error);
    }
    console.log(result);
    objects = result;
}

function draw(){
    image(video, 0, 0, 480, 380);
    
    if( Status != ""){
        objectDetector.detect(video, gotResult);
        for(i = 0; i < objects.length; i++){
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x, objects[i].y);

            fill("red");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 10, objects[i].y + 15);
            noFill();
            //stroke("blue");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if(objects[i].label == object_name){
                video.stop();
                var synth = window.speechSynthesis;
                var speak_data = object_name + " found";
                var utterThis = new SpeechSynthesisUtterance(speak_data);
                synth.speak(utterThis);
                objectDetector.detect(gotResult);
                document.getElementById("object_status").innerHTML = object_name + " found";
            }else{
                document.getElementById("object_status").innerHTML = object_name + " not found";
            }
        }
    }
}
