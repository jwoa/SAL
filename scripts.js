// Declare Variables


//   let getInput = prompt("Hey type something here: ");
   localStorage.setItem("storageName",getInput);

// Initiate Video

const vid = document.querySelector('video');
navigator.mediaDevices.getUserMedia({video: true}) // request cam
.then(stream => {
  vid.srcObject = stream; // don't use createObjectURL(MediaStream)
  return vid.play(); // returns a Promise
})
.then(()=>{ // enable the button
  const btn = document.querySelector('button');
  btn.disabled = false;
  btn.onclick = e => {
    takeASnap()
    .then(download);
  };
});

// Take a picture

function takeASnap(){
  const canvas = document.createElement('canvas'); // create a canvas
  const ctx = canvas.getContext('2d'); // get its context
  canvas.width = vid.videoWidth; // set its size to the one of the video
  canvas.height = vid.videoHeight;
  ctx.drawImage(vid, 0,0); // the video
  return new Promise((res, rej)=>{
    canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
  });

}

// Download the picture

function download(blob){
  // uses the <a download> to download a Blob
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'screenshot.jpg';
  document.body.appendChild(a);
  a.click();
}

// Face++ Api

function display() {
  let file = document.getElementById('file').files[0];

  let reader = new FileReader();
  reader.onload = function(e)  {
    let image = document.getElementById("image");
    image.src = e.target.result;
  }

  reader.readAsDataURL(file);
    document.querySelector('video').style.display = 'none';
    document.querySelector('hr').style.display = 'block';
    document.getElementById('right_text').style.display = 'none';
    document.getElementById('right_result').style.display = 'block';
}

function getParam() {
  let file = document.getElementById('file').files[0];
  let data = new FormData();

  data.append("api_key", "p-A5XPbMUbDA6sOxOmKb2QGRWgr4voHM");
  data.append("api_secret", "CiIvcnNPkhOLihcu5ccx37xFv49VzXxZ");
  data.append("return_attributes", "gender,age,emotion,ethnicity,beauty");
  data.append("image_file", file, "blob");

  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      let obj = JSON.parse(xhr.responseText);
      let faces = obj.faces;

     let tableRes = "";
      for (let i = 0; i < faces.length; i++) {
        let face = faces[i];
          console.log(face);
        let attrs = face.attributes;

        //alert(JSON.stringify(attrs));
        let sex = attrs.gender.value;
        let age = attrs.age.value;
        let ethn = attrs.ethnicity.value;
        let beauty;

        if (sex == "Male")
          beauty = attrs.beauty.male_score;
        else if (sex == "Female")
          beauty = attrs.beauty.female_score;

        if (i == 0)
          tableRes += getLine("Face#", "Gender", "Age", "Ethnicity", "MCS");

      tableRes += getLine(i+1, sex, age, ethn, beauty);
      }

      let table = document.getElementById("tableRes");
      table.innerHTML = tableRes;
    }
  }

  let url = "https://api-us.faceplusplus.com/facepp/v3/detect";
  xhr.open("POST", url, true);

  //Send the proper header information along with the request
  //xhr.setRequestHeader('Content-Type','multipart/form-data; boundary=' + boundary);

  xhr.send(data);
}

function getLine(index, sex, age, ethn, beauty)
{
  return "<tr><th>" + sex + "</th><th>" + age + "</th><th>" + ethn + "</th><th id='mcs'>" + beauty + "</th></tr>";
}

document.getElementById('mcs').addEventListener("click", function() {
    let MCS = document.getElementById('mcs');
    console.log(MCS);
    localStorage.setItem("storageName", MCS);
});
