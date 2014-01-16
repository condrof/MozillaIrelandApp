function serverError(){
	//navigator.splashscreen.show();
	if(navigator.connection.type === Connection.NONE){
		$.ui.loadContent("#error",true,true,"pop");
		return "No Internet Connection Detected. Please Check Your Settings";
	} else {
		$.ui.loadContent("#error",true,true,"pop");
		return "Server Error. Please try again later";
	}
}

function loadArticles(url, mainList, page){
	ga_storage._trackPageview(page, 'ArticlesList');
	$.ui.showMask("Loading...");
	$.getJSON(url,
	    {'foo':'bar'},
	    function(data){
	    	var list = "";
	        $.each(data.posts, 
	            function(i, post){
					list += "<li class=\"divider\"><h3>" + post.title + " by <strong>" + post.author.name + "</strong></li>";
	                list += "<li><div class='grid'  onclick=goToSingleArticle(" + post.id + ") id='" + post.id + "'>";
	                try{
	                	list += "<img src='" + post.thumbnail_images.thumbnail.url + "' class='floatLeft' />";
	                } catch(err){

	                }
	                if(post.excerpt.indexOf("<a class=\"go") !== -1){
	                	list += "" + post.excerpt.substring(0,post.excerpt.indexOf("<a class=\"go") ) + "";
	                } else {
	                	list += "" + post.excerpt + "";
	                }
	                
	                list += "<div></li>";

	                window.localStorage.setItem(post.id,  JSON.stringify(post));
	            }
	        );
	        $(mainList).html( list );
	        $.ui.hideMask()
	        $.ui.unblockUI()
	    }
	);
}

function cleanUpArticles(){
	$(".articlesList").empty();
}

function articlesPanel(){
	loadArticles('http://www.mozillaIreland.org/?json=1&callback=?', ".articlesList", "Articles");
}

function gaeilgePanel(){
	singlePage('http://www.mozillaIreland.org/as-gaeilge?json=1&callback=?', "As Gaeilge");
}

function aboutPanel(){
	singlePage('http://www.mozillaIreland.org/about?json=1&callback=?', "About Us");
}

function getInvolvedPanel(){
	singlePage('http://www.mozillaIreland.org/get-involved?json=1&callback=?', "Get Involved");

}

function goToSingleArticle(id){
	window.localStorage.setItem("articleId",  id);	
	singleArticle();
	$.ui.loadContent("#showArticle",true,true,"slide");
}

function singleArticle(){
	id = window.localStorage.getItem("articleId");	
	var post = JSON.parse(window.localStorage.getItem(id)) || [];
	ga_storage._trackPageview('/index#article' + post.title, post.title);
	var html = "";
	if(post.content.indexOf("//www.youtube.com") !== -1){
		html = "<div>" + post.content.replace("//www.youtube", "http://www.youtube", "g") + "</div>";
	} else {
		html = "<div>" + replaceAll("<a", "<p", post.content) + "</div>";
	}
	$("#singleArticle").html(html);	
}

function singlePage(url, page, id){
	ga_storage._trackPageview(page, 'Page');
	$.ui.showMask("Loading...");
	$.getJSON(url,
	    {'foo':'bar'},
	    function(data){
	    	var list = "";
	        list += "<h2>" + data.page.title + "</h2>";
	        list += "<div>" + replaceAll("<a", "<p", data.page.content) + "</div>";
	        
	        $(".pageContent").html( list );
	    }
	);
	$.ui.hideMask();
    $.ui.unblockUI();
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}