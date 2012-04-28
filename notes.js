	var def_name="Welcome";
	function tc(UNIX_timestamp){
		var a = new Date(UNIX_timestamp);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time = date+' '+month+' '+year+' '+hour+':'+min+':'+sec ;
		return time;
	}
	function $(id){return document.getElementById(id);}
	var wiki={
		nowWelcome:0, nowEdit:0,
		load: function (){
			
			if(localStorage.getItem('wiki')!==null){
				this.content=JSON.parse(localStorage.getItem('wiki'));
			}else{
				this.content=Array({title:def_name,text:"Hello, this is a NoteJS v 0.1.\nSimple wiki+html syntax support html5 (localStorage) based notebook.\nYou can not delete or rename this start page. Just edit.\nAuthor: Hormold (Nikita A.) - [http://about.hormold.ru]\n"});
			}			
		},
		save: function(){
			json=JSON.stringify(this.content);
			localStorage.setItem("wiki",json.replace("null,","").replace(",null",""));
		},
		add: function (title,content){
			if(title!=="" & content!==""){
				this.content.push({title:title,text:content,time:new Date().getTime()});
				this.open2(document.getElementById("wiki_title").value);
				this.save();
			}
		},
		edit: function(title){
			this.nowEdit=1;
			document.getElementById("wiki_title").value=title;
			nowWelcome=0;n1=null;
			_.each(this.content,function(num,key){
			if(num!==null){
				if(num.title==title){
					n1=key;
					text=num.text;
					if(title==def_name){nowWelcome=1;}

				}
			}
			});
			this.nowWelcome=nowWelcome;
			if(n1!==null){
				document.getElementById("wiki_text").value=text;
				document.getElementById("wiki_id").value=n1;
			}
		},
		delete: function(id){
			if(id!==def_name){
				o=this.content;
				_.each(this.content,function(num,key){
				if(num!==null){
					if(num.title==id){
						delete o[key];
					}
				}
				});
				console.log(o);
				this.open2(document.getElementById("wiki_title").value);
				this.save();
			}else{alert("This is a start page!");}
		},
		form: function(){
			if(document.getElementById("wiki_id").value=="save"){
				this.add(document.getElementById("wiki_title").value,document.getElementById("wiki_text").value);
				this.clear();
			}else{
				key=document.getElementById("wiki_id").value;
				console.log(this.nowWelcome);
				if(this.nowWelcome==1){document.getElementById("wiki_title").value=def_name;this.nowWelcome=0;}
				this.content[key]={time:new Date().getTime(),title:document.getElementById("wiki_title").value,text:document.getElementById("wiki_text").value};
				this.open2(document.getElementById("wiki_title").value);this.clear();this.save();
				this.nowEdit=0;
			}
		},
		make: function (num){
			var compiled = _.template("<div id='wiki'><div id='title'><%= title %> <span id='buttons'><a href='javascript:wiki.delete(\"<%= title %>\");'>(X)</a> <a href='javascript:wiki.edit(\"<%= title %>\");'>(E)</a></span></div><div id='time'><%= time %></div><div id='text'><%= text %></div></div>");
			return compiled({title : num.title,text: num.text.wiki2html(),time:num.time});
		},
		draw: function (content){
			n="";m=this.make;
			_.each(content,function(num,key){
				if(num!==null && num.length!==0 && num.text){
				if(!num.time){num.time=""}else{num.time=tc(num.time);}
					n+=m(num);
				}
			});
			document.getElementById("wiki").innerHTML=n;
		},
		open2: function(name){
			if(!this.open(name)){
				if(!this.open(def_name)){
					this.draw();
				}else{this.edit(name);utils.focus("wiki_text");}
			}
		},		
		open: function(name){
			tmp=null;
			_.each(this.content,function(num,key){
				if(!num.time){num.time=""}else{num.time=tc(num.time);}
				if(num.title==name){tmp=num;}
			});
		
			if(tmp==null){return false;}else{
				document.getElementById("wiki").innerHTML=this.make(tmp);
				if(this.page!==null){this.oldpage=this.page;}
				this.page=name;
				return true;
			}
		},
		
		clear: function(){
			document.getElementById("wiki_title").value="";
			document.getElementById("wiki_text").value="";
			document.getElementById("wiki_id").value="save";
		},
		
		search: function(query){
			if(query==""){wiki.open2(def_name);}else{
				out=Array();
				_.each(this.content,function(num,key){
					t=num.text;
					s=t.indexOf(query);
					if(s!=-1){t=num.text.replace(query,"<font color='red'>"+query+"</font>");out.push({title:num.title,text:t,time:num.time});}
				});
				if(out.length==0){
					$("wiki").innerHTML="<div id='title'>Error, not found.</div>";
				}else{
				this.draw(out);}
			}
		},
		
		init: function(){
			if(!this.open(def_name)){this.draw(this.content);}
		}
	};
	var utils={
		bck:0,
		backup: function(){
			if(localStorage.getItem("wiki")!==null){
				get=localStorage.getItem("wiki");
				if(this.bck==1){get="";this.bck=0;}else{this.bck=1;}
				$("backup").innerHTML=_.escape(get);
			}			
		},
		
		back: function(){
			if(wiki.nowEdit==0){
				if(wiki.oldpage){
					wiki.open2(wiki.oldpage);
				}
			}
		},
		
		focus: function(name){
			document.getElementById(name).focus();
		},
		
		list: function(){
			out="<div id='title'>List of pages:</div><ul>";
			_.each(wiki.content,function(num,key){
				out+="<li style='font-size:110%' id='title'><a class='n' href='javascript:wiki.open2(\""+num.title+"\");'>"+num.title+"</a></li>";
			});
			out+="</ul>";
			$("wiki").innerHTML=out;
		},
		
		hotkeys: function (e) {
		  if (!e) e = window.event;
		  var k = e.keyCode;
		  if (e.ctrlKey) {
			if (k == 37) { utils.back(); } // Ctrl+Left
			//if (k == 39) {  } // Ctrl+Right
		  }
		},
		ctrl_enter: function(e) {
		if (((e.keyCode == 13) || (e.keyCode == 10)) && (e.ctrlKey == true)){$("submit").click();}
		}
	};
/*
  @author: remy sharp / http://remysharp.com
  @url: http://remysharp.com/2008/04/01/wiki-to-html-using-javascript/
  @license: Creative Commons License - ShareAlike http://creativecommons.org/licenses/by-sa/3.0/
  @version: 1.0
  
  Can extend String or be used stand alone - just change the flag at the top of the script.
*/

(function () {
    
var extendString = true;

if (extendString) {
    String.prototype.wiki2html = wiki2html;
    String.prototype.iswiki = iswiki;
} else {
    window.wiki2html = wiki2html;
    window.iswiki = iswiki;
}

// utility function to check whether it's worth running through the wiki2html
function iswiki(s) {
    if (extendString) {
        s = this;
    }

    return !!(s.match(/^[\s{2} `#\*='{2}]/m));
}

// the regex beast...
function wiki2html(s) {
    if (extendString) {
        s = this;
    }
    
    // lists need to be done using a function to allow for recusive calls
    function list(str) {
        return str.replace(/(?:(?:(?:^|\n)[\*#].*)+)/g, function (m) {  // (?=[\*#])
            var type = m.match(/(^|\n)#/) ? 'OL' : 'UL';
            // strip first layer of list
            m = m.replace(/(^|\n)[\*#][ ]{0,1}/g, "$1");
            m = list(m);
            return '<' + type + '><li>' + m.replace(/^\n/, '').split(/\n/).join('</li><li>') + '</li></' + type + '>';
        });
    }
    
    return list(s
        
        /* BLOCK ELEMENTS */
        .replace(/(?:^|\n+)([^# =\*<].+)(?:\n+|$)/gm, function (m, l) {
            if (l.match(/^\^+$/)) return l;
            return "\n<p>" + l + "</p>\n";
        })

        .replace(/(?:^|\n)[ ]{2}(.*)+/g, function (m, l) { // blockquotes
            if (l.match(/^\s+$/)) return m;
            return '<blockquote>' + l + '</pre>';
        })
        
        .replace(/((?:^|\n)[ ]+.*)+/g, function (m) { // code
            if (m.match(/^\s+$/)) return m;
            return '<pre>' + m.replace(/(^|\n)[ ]+/g, "$1") + '</pre>';
        })

        .replace(/(?:^|\n)([=]+)(.*)\1/g, function (m, l, t) { // headings
            return '<h' + l.length + '>' + t + '</h' + l.length + '>';
        })
    
        /* INLINE ELEMENTS */
        .replace(/'''(.*?)'''/g, function (m, l) { // bold
            return '<strong>' + l + '</strong>';
        })
    
        .replace(/''(.*?)''/g, function (m, l) { // italic
            return '<em>' + l + '</em>';
        })
    
        .replace(/[^\[](http[^\[\s]*)/g, function (m, l) { // normal link
            return '<a href="' + l + '">' + l + '</a>';
        })
    
        .replace(/[\[](http.*)[!\]]/g, function (m, l) { // external link
            var p = l.replace(/[\[\]]/g, '').split(/ /);
            var link = p.shift();
            return '<a href="' + link + '">' + (p.length ? p.join(' ') : link) + '</a>';
        })
    
        .replace(/\[\[(.*?)\]\]/g, function (m, l) { // internal link or image
            var p = l.split(/\|/);
            var link = p.shift();

            if (link.match(/^Image:(.*)/)) {
                // no support for images - since it looks up the source from the wiki db :-(
                return m;
            } else {
                return '<a href="javascript:wiki.open2(\'' + link + '\');">' + (p.length ? p.join('|') : link) + '</a>';
            }
        })
    ); 
}
    
})();