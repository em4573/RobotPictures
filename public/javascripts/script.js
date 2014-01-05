if (!XMLHttpRequest.prototype.sendAsBinary) {
  XMLHttpRequest.prototype.sendAsBinary = function (sData) {
  var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
  for (var nIdx = 0; nIdx < nBytes; nIdx++) {
  ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
  }
  /* send as ArrayBufferView...: /
  this.send(ui8Data);
  / ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
  };
}

(function() {

  var streaming = false,
      video        = document.querySelector('#video'),
      cover        = document.querySelector('#cover'),
      canvas       = document.querySelector('#canvas'),
      startbutton  = document.querySelector('#startbutton'),
      width = 200,
      height = 0;

  navigator.getMedia = ( navigator.getUserMedia || 
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    { 
      video: true, 
      audio: false 
    },
    function(stream) {
      if (navigator.mozGetUserMedia) { 
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
      }
      video.play();
    },
    function(err) {
      console.log("An error occured! " + err);
    }
  );

  video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  var takepicture = function takepicture() {
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL('image/png');
    return data;
  }

  startbutton.addEventListener('click', function(ev){
      var picture = takepicture();
      console.log(picture);
    ev.preventDefault();
    var oReq = new XMLHttpRequest();
    oReq.onload = function(data){
      console.log(data);
    };
    oReq.open("post", "localhost:3000/images", true);
    oReq.setRequestHeader('content-type', 'image/png');
    oReq.sendAsBinary(picture);
  }, false);

})();


