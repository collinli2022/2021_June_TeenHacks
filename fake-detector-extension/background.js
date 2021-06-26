// var siteList = new Set(["youtube", "chess", "bit"]);
// var recent = []
// var max_recent = 5

// chrome.storage.sync.clear()

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (!tab.url.match(/^about:/)) {

//     chrome.storage.sync.get('site_list', function(result) {
//       console.log('Value currently is ' + result.key);
//       if (typeof(result.key) == "undefined") {
//         chrome.storage.sync.set({"site_list": siteList}, function() {
//           console.log('Value is set to ' + siteList);
//         });
//       }
//     });

//     var searchingHistory = chrome.history.search({
//         text: tab.url,
//         maxResults: max_recent
//       }, // the query object
//       (results) => {
//         for (var k in results) {
//           var history = results[k]
//           for (let i of siteList) {
//             if (history.url.indexOf(i) != -1) {
//               chrome.history.deleteUrl({
//                 url: results[k].url
//               }, (res) => {});
//               recent.push(results[k].url)
//               if (recent.length > max_recent) {
//                 recent.shift()
//               }
//             }
//           }
//         }
//       })
//     recent = [...new Set(recent)];
//   }
// });

// function getSiteList() {
//   return siteList
// }
// function setSiteList(replace) {
//   siteList = replace
// }

// /*
// chrome.storage.sync.set({key: value}, function() {
//   console.log('Value is set to ' + value);
// });

// chrome.storage.sync.get(['key'], function(result) {
//   console.log('Value currently is ' + result.key);
// });
// */

let MAXLEN = 1000
let WORD_INDEX = JSON.parse($.ajax({
  dataType: "json",
  url: './tools/tokenizer_word_index.json',
  async: false
}).responseText);

let tokenize = (text) => {
  text = text.toLowerCase()
  text = text.replace(/[^\w\s'-]/gi, '')
  text = text.replace(/\n/g, '').replace(/\t/g, '')
  return text.split(' ')
}

let text_to_sequence = (text) => {
  let tokens = tokenize(text)
  var indicies = tokens.map(x =>
    WORD_INDEX[x] == 'undefined' ? -1 : WORD_INDEX[x])
  return indicies.filter(x => x != -1)
}

let pad_sequence = (seq, maxlen) => {
  if (seq.length > maxlen)
    return seq.slice(seq.length-maxlen, seq.length)
  for (var i = seq.length; i < maxlen; i++)
    seq.unshift(0)
  return seq
}

let process_text = (text) => {
  return tf.tensor([pad_sequence(text_to_sequence(text), MAXLEN)])
}

// Load trained Keras model
var model;
(async () => {
  model = await tf.loadModel('./tools/tfjs/model.json')
})().then(() => {
  $('#prediction #circle').removeClass('loading').addClass('real')
  $('#prediction #helper').text('Ready')
});

async function evaluate(text) {
  let prediction = await model.predict(process_text(text)).get(0, 0)
  return prediction
}

var typingTimer;
$('#news_content').keyup(() => {
  clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    $('#prediction #circle').removeClass('real').removeClass('fake').addClass('loading')
    $('#prediction #helper').text('Generating prediction...')
    evaluate($('#news_content').val())
  }, 1000);
})
