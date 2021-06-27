// Global Vars
var api_key = "da7562a9868e4e7bad3d70430880a1b7"
var max_articles = 5
const bg = chrome.extension.getBackgroundPage()

window.resizeTo("600px", "800px");

async function eval(d) {
  var result = await bg.evaluate(d);

  if (result > 0.5) {
    document.getElementById("result").innerHTML = `News article is likely to be unreliable (${result.toFixed(2)})`
  } else {
    document.getElementById("result").innerHTML = `News article is likely to be reliable (${result.toFixed(2)})`
  }
}

window.onload = function() {
  chrome.tabs.getSelected(null,function(tab) { // null defaults to current window
    var title = tab.title;
    bg.console.log(title)
    //title = title.substring(0, (title.search(/[^a-z0-9\s]+/ig)))
    //title = title.substring(0, (title.search("-")))
    for (var i = 0; i < 4; i++) {
      title = title.substring(0, title.lastIndexOf(" "));
    }
    
    bg.console.log(title)
    
    var complete_url = `https://newsapi.org/v2/everything?q=${title}&sortBy=popularity&apiKey=${api_key}` // https://newsapi.org/v2/everything?q=Apple&from=2021-06-26&sortBy=popularity&apiKey=da7562a9868e4e7bad3d70430880a1b7


    fetch(complete_url).then(response => 
      response.json().then(data => ({
          data: data,
          status: response.status
      })
    ).then(res => {
        bg.console.log(res.status, res.data)
        for (var i = 0; i < max_articles; i++) {
          bg.console.log(`Related Articles ${title} (5 results):`)
          //document.getElementByID("recent").innerHTML = `<p> Related Articles ${title} (5 results): <p>`
          document.getElementById("POV_sites").innerHTML += `<li><a href=${res.data.articles[i].url}>${res.data.articles[i].title}</a></li>`
        }
    }));

  });
};



document.getElementById("set").onclick = function() {
  var d = document.getElementById("text").value;
  bg.console.log(d);
  eval(d);
}

window.onload = ()=>{
  document.getElementById("text").value = bg.sel
  if (bg.sel) {
    bg.console.log(bg.sel);
    eval(bg.sel);
  }
}
