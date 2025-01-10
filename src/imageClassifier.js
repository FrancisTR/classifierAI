//Initialize our ml5 and dictionary to store image IDs from google
let classifier = ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/veVmi7GVA/"); //Access our ml5.js for image classification

//Every img has a corresponding ID on google. We use that ID as key and the value is its parent div
//to indicate that the image is scanned.
let imageClassified = {}; //Use to keep track of images on google and avoid duplicates when performing ML

//Start observing the image section on google
window.onload = () => {
  // Select the node that will be observed for mutations
  const targetNode = document.getElementById("gsr"); // whole HTML page on the image section on google
  selfObserver(targetNode);
};



/*
  This function is responsible for observing the web page.
  If any changes occur on the webpage, call the main function to perform its tasks.
*/
function selfObserver(documentNode) {
  // Create an observer instance for main
  const observer = new MutationObserver(function () {
    main();
  });

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Start observing
  observer.observe(documentNode, config);
}



/*
  This function is the main functionality that will perform image classification for 
  all images on google.
*/
function main() {
  console.log("Initiate Machine Learning");
  runML(); //Start



  /*
    This function gets all the image on the current page and store them in a dictionary.
    For each image, we scan to see if the Image is AI-Generated.
  */
  function runML() {
    // Get all the div that has this specific class name.
    // bFtXbb CUMKHb uhHOwf BYbUcd -dev mode
    // H8Rx8c -normal mode

    //WIP
    // p7sI2 PUxBg -img preview (User click on image to see the img bigger)
    // fR600b islir -img suggestion (under img preview)
    let img = document.querySelectorAll(".bFtXbb.CUMKHb.uhHOwf.BYbUcd, .H8Rx8c"); //This is a specific class name google used that contains an image.

    // For each div (that contains an image), we store them in a dictionary to prevent dup scans
    for (let i of img) {
      //If the image that we have given base on observer is new, add it
      if (!(i.getElementsByTagName("img")[0].id in imageClassified)) {
        imageClassified[i.getElementsByTagName("img")[0].id] = "IMAGE"; //Store it

        iconAssigned(null, i); //Loading icon

        imageClassificationScan(i); //Start the scan for that image to see if the image is Ai-Generated
        // console.log(i.getElementsByTagName("img")[0]); //Img tag
        // console.log(i.getElementsByTagName("img")[0].id); //Img id=???
      }
    }
  }



  /*
    This function performs image classification to determine if the image is AI-Generated.
    This will ultimately change the status icon on the webpage to show the user if the image is AI-Generated.
  */
  function imageClassificationScan(imgObj) {
    //This extracts the image link from the img tag into our img Object
    const img = loadImage(imgObj.getElementsByTagName("img")[0].src);
    
    //Gives us the result of our classification (WIP)
    let result = classifier.classify(img);
    result.then((results) => {
        iconAssigned(results, imgObj);
      })
      .catch((error) => {
        console.error(error); // Handles any errors
      });
  }



  /*
    This helper function loads the image by config the crossorgin and assigning it to the img tag.
    This is needed to process all images on google. 
  */
  function loadImage(src) {
    var img = new Image();
    img.setAttribute("crossorigin", "anonymous");
    img.src = src;
    return img;
  }



  /*
    This function assign icons to the image base on the confidence rate. (WIP)
    NOTE: If the confidence rate is less than 60 percent whether it is AI or not, then it is AI Neutral
  */
  function iconAssigned(results, imgObj) {
    // Create the img tag for our status icon
    var statusImg = document.createElement("img");
    statusImg.setAttribute("id", "FrancisTRStatusAI");
    
    // Get our data and assign the icon (WIP)
    try {
      let result = [results[0].label, results[0].confidence * 100]; //Clean up data.
      console.log(result);
      if (result[0] === "AI"){
        statusImg.src = chrome.runtime.getURL("Images/AIGenerated.png");
      }else if (result[0] === "NotAI"){
        statusImg.src = chrome.runtime.getURL("Images/AIFree.png");
      }else{ //WIP
        statusImg.src = chrome.runtime.getURL("Images/AINeutral.png");
      }
    } catch (error) {
      statusImg.src = chrome.runtime.getURL("Images/loading.gif"); // This is the case if results is null.
    }

    imgObj.appendChild(statusImg);
  }
}
