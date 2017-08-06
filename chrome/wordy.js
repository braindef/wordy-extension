(function() {
  var pageText;
  var counter = {

    analyze: function(text, min, regex) {
      this.data = {};
      this.data.total = 0;
      var wordCounts = {};
      var allWords = text.split(/[\?\!\.\,;]*[\s+–]|[\?\!\.\,;]$/);
      allWords.forEach(function(word) {
        word = word.toLowerCase();
        if ((word.length >= min) &&
          !/[^a-zA-ZÅåÄäâàáÖöØøÆæÉéÈèÜüÊêÛûÎî\-\']/.test(word) &&
          regex.test(word)) {
            wordCounts[word] ? wordCounts[word]++ : wordCounts[word] = 1;
            this.data.total++;
        }
      }, this);

      this.data.words = Object.keys(wordCounts).sort(
        function(a,b){return wordCounts[b]>wordCounts[a]?1:-1}).map(
          function(e) {return [e, wordCounts[e]]});

      return this;
    },


    tabulate: function() {
      var result = '';
      this.data.words.forEach(function(datum) {
        
        result += '<tr>';
        result += '<td style="padding-right: 15px">';

        if(checkword(datum[0]))
        { result+='<font color=tomato>';
        }

        result += datum[0];
        result += '</font></td><td  style="padding-right: 15px">';
        result += datum[1];
        result += '</td><td  style="padding-right: 45px">';
        result += ['(', (100*(datum[1]/this.data.total)).toFixed(2), '%)'].join('');
        result += '</td>';
        result += '</tr>';
      }, this);
      return result;
    }
  }

  function init() {
    document.querySelector('#slider').addEventListener('change', update);
    document.querySelector('#regex').addEventListener('keyup', update);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: 'from extension'}, function(response) {
        pageText = response.data;
        update();
      });
    });
  }

  function checkword(word) {
    var x=word;
    if(["quantenheilung","trump","kristalle","matrix","trump","fakenews"].indexOf(x) !== -1)
    {
      document.querySelector('#header').innerHTML = "Schwurbler Alarm" 
      return true;
    }
    else
      return false;
  }

  function update(minSize, regex) {
    document.querySelector('#data').innerHTML = counter.
      analyze(
        pageText,
        Number(document.querySelector('#slider').value),
        new RegExp(document.querySelector('#regex').value)).
      tabulate();
  }

  //init popup or globalize counter for testing
  document.querySelector('#data') ? init() : (window.counter = counter);
})();



