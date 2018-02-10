function getClasses(elm) {
    var currentClassName = elm.className || "";
    return currentClassName.split(" ");
}

function addClass(elm, className) {
    var classes = getClasses(elm);
    classes.push(className);
    elm.className = classes.join(" ");
}

function removeClass(elm, className) {
    var classes = getClasses(elm);
    var newClasses = classes.filter(c => c != className);
    elm.className = newClasses.join(" ");
}

function startCamera() {
    navigator.getUserMedia({video:true}, gotStream, noStream);

    setInterval(snapshot, 3100);
}

function gotStream(stream) {
    var video = document.getElementById('video');

    video.src = window.URL.createObjectURL(stream);    
    video.play();
}

function snapshot()
{
    var aspect = video.videoWidth / video.videoHeight;
    var width = 400;
    var height = width / aspect;

    var canvas = document.getElementById('canvas');
	canvas.width = width;
	canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);

    ctx = canvas.getContext('2d');
    var dataUrl = canvas.toDataURL("image/png");
    var blob = makeblob(dataUrl)
    post(blob, parseFaceData);
}

function makeblob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

function post(data, callback) {
    var url = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=gender,glasses";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/octet-stream");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "<INSERT YOUR KEY HERE>");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.response));
        }
    };

    xhr.send(data); 
}

function parseFaceData(faceData) {
    var faces = faceData.length;
    var males = faceData.filter(c => c.faceAttributes && c.faceAttributes.gender == "male").length;
    var females = faceData.filter(c => c.faceAttributes && c.faceAttributes.gender == "female").length;
    var glasses = faceData.filter(c => c.faceAttributes && c.faceAttributes.glasses != "NoGlasses").length;

    console.log("The three eyed raven detected: ", faces, "faces - males:", males, "females:", females)

    togglePopup("popup-male", males)
    togglePopup("popup-female", females)
    togglePopup("popup-horse", glasses)
}

var intervals = {};
function togglePopup(id, show) {
    var popup = document.getElementById(id);
    var count = popup.getElementsByClassName("count")[0];

    if(show) {
        if(show==1) {
            count.innerHTML="a coat ";
        } else {
            count.innerHTML=show + " coats ";
        }
        addClass(popup, "visible")
        clearInterval(intervals[id]);
    } 
    else {
        intervals[id] = setTimeout(() => {
            removeClass(popup, "visible")
        },3000)
    }
}

function noStream() {
    console.log("noStream");
}

startCamera()