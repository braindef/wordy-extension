chrome.tabs.onCreated.addListener(function ( tab ){
alert(tab.url);


});
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   alert(changeInfo.url);

}); 

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab){
     console.log(tab.url);

  });
});
