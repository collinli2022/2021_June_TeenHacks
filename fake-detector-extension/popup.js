window.resizeTo("600px", "800px");

const bg = chrome.extension.getBackgroundPage()

async function eval(d){
  var result = await bg.evaluate(d);

  if (result > 0.5) {
    document.getElementById("result").innerHTML = `News article is likely to be unreliable (${result.toFixed(2)})`
  } else {
    document.getElementById("result").innerHTML = `News article is likely to be reliable (${result.toFixed(2)})`
  }
}

document.getElementById("set").onclick = function() {
  var d = document.getElementById("text").value;
  bg.console.log(d);
  eval(d);
}

window.onload = ()=>{
  document.getElementById("text").value = bg.sel
  if (bg.sel){
    bg.console.log(bg.sel);
    eval(bg.sel);
  }
}