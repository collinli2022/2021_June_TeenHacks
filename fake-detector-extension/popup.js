document.getElementById("set").onclick = function() {
  const bg = chrome.extension.getBackgroundPage()
  // var siteListset = bg.getSiteList()
  var d = document.getElementById("text").value;
  bg.console.log(d)
  async function eval(){
    //await function(){document.getElementById("result").innerHTML = 'Predicting...'}()
    var result = await bg.evaluate(d);
    bg.console.log(result);
    bg.console.log(`${result.toFixed(2)})`)

    if (result > 0.5) {
      //$('#prediction #circle').removeClass('loading').addClass('fake')
      //$('#prediction #helper').text(`News article is likely to be unreliable (${prediction.toFixed(2)})`)
      await function(){document.getElementById("result").innerHTML = `News article is likely to be unreliable (${result.toFixed(2)})`}()
    } else {
      //$('#prediction #circle').removeClass('loading').addClass('real')
      //$('#prediction #helper').text(`News article is likely to be reliable (${prediction.toFixed(2)})`)
      await function(){document.getElementById("result").innerHTML = `News article is likely to be reliable (${result.toFixed(2)})`}()
    }
  }
  eval();
  // bg.siteList = siteListset
  // updateSiteList()
}