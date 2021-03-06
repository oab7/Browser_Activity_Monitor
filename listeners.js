/* Each listener commits to LocalStorage with an action name the same as the listener.
Most listeners jsut store the information provided by the api.  Comments will when
information is gathered and/or stored and its purpose.*/

chrome.tabs.onCreated.addListener(function(tab) {
	//When the opened tab is that stat page don't log it
	if(isStat(tab.url)){return;}
	var otherInfo = new Array();
	addToLocalStorage("tabs.onCreated", tab.windowId, tab.id, tab.url, otherInfo);
});

chrome.tabs.onRemoved.addListener(function(tabId) {
	//Check to see if the tab is the stat page and if it is do not log event
    var flag=false;
    for(var i=0;i<localStorage.statLength;i++){
		if(localStorage.getItem("stat"+i)==tabId){
			flag=true;
			break;
		}
    }
    if(localStorage.getItem("isDebugMode")=="no" && flag){return;} 
	var otherInfo = new Array();
	addToLocalStorage("tabs.onRemoved", localStorage.getItem(tabId), tabId, "-", otherInfo);     
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	var otherInfo = new Array();
	otherInfo = ["status", changeInfo.status];
	addToLocalStorage("tabs.onUpdated", tab.windowId, tabId, tab.url, otherInfo);
});

chrome.tabs.onDetached.addListener(function(tabId,detachInfo){
	//Check to see if the tab is the stat page and if it is do not log event
    var flag=false;
    for(var i=0;i<localStorage.statLength;i++){
        if(localStorage.getItem("stat"+i)==tabId){
            flag=true;
            break;
        }
    }
    if(flag){return;}
	var otherInfo = new Array;
	addToLocalStorage("tabs.onDetached", detachInfo.oldWindowId, tabId, "-", otherInfo);
});

chrome.tabs.onAttached.addListener(function(tabId,attachInfo){
	//Check to see if the tab is the stat page and if it is do not log event
	var flag=false;
	for(var i=0;i<localStorage.statLength;i++){
		if(localStorage.getItem("stat"+i)==tabId){
			flag=true;
			break;
		}
	}
	if(localStorage.getItem("isDebugMode")=="no" && flag){return;}
	var otherInfo = new Array;
	addToLocalStorage("tabs.onAttached", attachInfo.newWindowId, tabId, "-", otherInfo);
});

chrome.tabs.onSelectionChanged.addListener(function(tabId,selectInfo){
	//Get the old tabId out of localStorage so the focusoff event can be logged
	var oldTabId=localStorage.getItem("window"+selectInfo.windowId+"Focused");
	var otherInfo = new Array();
	if(oldTabId!=null){
		otherInfo = ["focusoff"];
		addToLocalStorage("tabs.onSelectionChanged", selectInfo.windowId, oldTabId, "-", otherInfo);
	}
	otherInfo = ["focuson"];
	addToLocalStorage("tabs.onSelectionChanged", selectInfo.windowId, tabId, "-", otherInfo);
	//Save this tabId so it can be used next time the selection changes
	localStorage.setItem("window"+selectInfo.windowId+"Focused", tabId);
});

chrome.history.onVisited.addListener(function(result){
	//ignore if this is the stat page
	if(isStat(result.url)){return;}
	var windowId = "-";
	var tabArray = new Array();
	var otherInfo = ["loadTime", result.lastVisitTime, "id", result.id, "title", result.title, "visitCount", result.visitCount, "typed", result.typedCount];
/*	chrome.windows.getAll({'populate': true}, function(windows){
		for(var i = 0; i < windows.length; i++){
			console.log("hello");
			var window = windows[i];
			windowId = window.id;
			for(var j = 0; j < window.tabs.lengths; j++){
				var tab = window.tabs[j];
				tabArray.push(tab);
			}
		}
	});*/
	addToLocalStorage("history.onVisited", "-", "-", result.url, otherInfo);
});

chrome.history.onVisitRemoved.addListener(function(removed){
	var otherInfo = new Array();
	if(removed.allHistory){
		otherInfo = ["removedAll", true];
	}
	else{
		otherInfo = ["removed", false, "urls"];
		for (var i = 0; i < removed.urls.length; i++){
			otherInfo.push(" "+removed.urls[i]);
		}
	}
	addToLocalStorage("history.onVisitRemoved", "-", "-", "-", otherInfo);
});

chrome.windows.onCreated.addListener(function(window) {
	var otherInfo = ["type", window.type];
	addToLocalStorage("windows.onCreated", window.id, "-", "-", otherInfo);
});

chrome.windows.onRemoved.addListener(function(windowId) {
	var otherInfo = new Array();
	addToLocalStorage("windows.onRemoved", windowId, "-", "-", otherInfo);
});

chrome.windows.onFocusChanged.addListener(function(windowId){
	//Get the old window Id out of localStorage so we can log focus being turned off
	var oldWindowId=localStorage.getItem("windowFocused");
	if(windowId==oldWindowId){return;}
	var otherInfo = new Array();
	if(oldWindowId!=-1 || oldWindowId!=null){
		otherInfo = ["windowfocusoff"];
		addToLocalStorage("windows.onFocusChanged", oldWindowId, "-", "-", otherInfo);
	}
	otherInfo = ["windowfocuson"];
	addToLocalStorage("windows.onFocusChanged", windowId, "-", "-", otherInfo);
	//Save this windows id so it can be used next time the focus is changed
	localStorage.setItem("windowFocused",windowId);
});

chrome.bookmarks.onCreated.addListener(function(id, bookmark){
	/*Save the information about the bookmark title and url so that it
	* can be accessed when the bookmark is removed*/
	localStorage.setItem("bookmark"+id+"title",bookmark.title);
	localStorage.setItem("bookmark"+id+"url",bookmark.url);
	var otherInfo = ["title", bookmark.title, "id", bookmark.id, "parentId", bookmark.parentId, "index", bookmark.index, "dateAdded", bookmark.dateAdded, "dateGroupModified", bookmark.dateGroupModified];
	addToLocalStorage("bookmarks.onCreated", "-", "-", bookmark.url, otherInfo);
});

chrome.bookmarks.onChanged.addListener(function(id,changeInfo){
	var otherInfo = ["title", changeInfo.title, "id", id, "oldUrl", oldUrl=localStorage.getItem("bookmark"+id+"url"), "oldTitle", localStorage.getItem("bookmark"+id+"title")];
	addToLocalStorage("bookmarks.onChanged", "-", "-", changeInfo.url, otherInfo);
 });

chrome.bookmarks.onRemoved.addListener(function(id,removeInfo){
	//Extract the saved information from localStorage so that the title and url can be produced
	var otherInfo = ["id", id, "title", localStorage.getItem("bookmark"+id+"title"), "parentId", removeInfo.parentId, "bookmarkIndex", removeInfo.index]
	addToLocalStorage("bookmarks.onRemoved", "-", "-", localStorage.getItem("bookmark"+id+"url"), otherInfo);
});

chrome.bookmarks.onImportBegan.addListener(function(){
	var otherInfo = new Array();
	addToLocalStorage("bookmarks.onImportBegan", "-", "-", "-", otherInfo);
});

chrome.bookmarks.onImportEnded.addListener(function(){
	var otherInfo = new Array();
	addToLocalStorage("bookmarks.onImportEnded", "-", "-", "-", otherInfo);
});

chrome.bookmarks.onMoved.addListener(function(id, moveInfo){
	var otherInfo = ["id", id, "parentId", moveInfo.parentId, "index", moveInfo.index, "oldParentId", moveInfo.oldParentId, "oldIndex", moveInfo.oldIndex];
	addToLocalStorage("bookmarks.onMoved", "-", "-", "-", otherInfo);
});

chrome.bookmarks.onChildrenReordered.addListener(function(id, reorderInfo){
	var otherInfo = ["id", id, "childIds"];
	for(var i = 0; i < reorderInfo.childIds.length; i++){
		otherInfo.push(" " + reorderInfo.childIds[i]);
	}
	addToLocalStorage("bookmarks.onChildrenReordered", "-", "-", "-", otherInfo);
});