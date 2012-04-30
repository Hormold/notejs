	var def_name="Welcome";
	var server="http://localhost/server.php";//url or false
	var server_id="c1ee33b7fb8c0cab957515a6dc9f319f"; //ask on server
	var table="wiki"; //in localStorage
	var saving=true;
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
	function get(url){var script = document.createElement("script"); script.type  = "text/javascript"; script.src = url; document.body.appendChild(script);}
	var wiki={
		nowWelcome:0, nowEdit:0,nowWatching:"",
		load: function (){
			if(localStorage.getItem(table)!==null){
				this.content=JSON.parse(localStorage.getItem(table));
			}else{
				this.content=Array({title:def_name,text:"Hello, this is a NoteJS v 0.2.\nSimple wiki+html syntax support html5 (localStorage) based notebook.\nYou can not delete or rename this start page. Just edit.\nAuthor: Hormold (Nikita A.) - [http://about.hormold.ru]\n"});
			}
		},
		save: function(){
			if(saving==true){
				json=JSON.stringify(this.content);
				localStorage.setItem(table,json.replace("null,","").replace(",null",""));
			}
		},
		add: function (title,content){
			if(title!=="" & content!==""){
				this.content.push({title:title,text:content,time:new Date().getTime()});
				this.open2(document.getElementById("wiki_title").value);
				this.save();
			}
		},
		edit: function(title){
			this.nowEdit=title;
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
				utils.focus("wiki_text");
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
				if(this.nowWelcome==1){document.getElementById("wiki_title").value=def_name;this.nowWelcome=0;}
				this.content[key]={time:new Date().getTime(),title:document.getElementById("wiki_title").value,text:document.getElementById("wiki_text").value};
				this.open2(document.getElementById("wiki_title").value);this.clear();this.save();
				this.nowEdit=0;
			}
		},
		make: function (num){
			if(num.title!=def_name){button="<a title='Delete' href='javascript:wiki.delete(\"<%= title %>\");'>(X)</a>";}else{button='';}
			var tpl="<div id='wiki'><div id='title'>"+num.title+"<span id='buttons'>"+button+" <a href='javascript:wiki.edit(\""+num.title+"\");' title='Edit page'>(E)</a></span></div><div id='time'>Last modified: "+num.time+"</div><div id='text'>"+num.text.wiki2html()+"</div></div>";
			return tpl;
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
			localStorage.setItem(table+"_last",name);
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
		hl: function( data, search ){
			var regex = new RegExp( '(' + search + ')', 'gi' );
			return data.replace( regex, "<font color=red>$1</font>" );
		},
		
		search: function(query){
			hl=this.hl;
			if(query==""){wiki.open2(def_name);}else{
				out=Array();list=Array();
				_.each(this.content,function(num,key){
					q=query.toLowerCase();
					t=num.text.toLowerCase();
					t2=num.title.toLowerCase();
					s=t.indexOf(q);
					
					s2=t2.indexOf(q);
					if(s!=-1){
						t=this.hl(num.text,query);
						list[key]=1;
						out.push({title:num.title,text:t,time:num.time});
					}
					if(s2!=-1){
						t=this.hl(num.title,query);
						if(!list[key]){
							out.push({title:t,text:num.text,time:num.time});
						}
					}
				
				});
				if(out.length==0){
					$("wiki").innerHTML="<div id='title'>Error, not found.</div>";
				}else{
				this.draw(out);}
			}
		},
		
		init: function(){
			if(localStorage.getItem(table+"_last")){this.open2(localStorage.getItem(table+"_last"));}else{
			if(!this.open(def_name)){this.draw(this.content);}}
		}
	};
	var utils={
		bck:0,
		backup: function(){
			if(localStorage.getItem(table)!==null){
				get=localStorage.getItem(table);
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
		
		insert: function(){
			var a = new Date();
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var time = date+' '+month+' '+year;
			$('wiki_title').value=$('wiki_title').value+time;
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
		},
		
		backup_server: function(){
			if(server_id!=false && server!=false){
				if(localStorage.getItem(table)!==null){
					e=encode(localStorage.getItem(table));
					url=server+"?act=set&key="+server_id+"&value="+escape(e);
					get(url);
				}
			}
		},
		backup_server2: function(type,date){
			if(type=='done'){
				alert("Saved to server!");
			}else{
				d=decode(date);
				if(d!==""){
					localStorage.setItem(table,d);
					saving=false;
					location.href=location.href+"?loaded=true";
				}
			}
		},
		import_server: function(){
			if(server_id!=false && server!=false){
				url=server+"?act=get&key="+server_id;
				get(url);
			}
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
    
//var extendString = true;
String.prototype.wiki2html = wiki2html;

function wiki2html() {
    s=this;
    
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
                return "<img src='"+m+"'/>";
            } else {
                return '<a href="javascript:wiki.open2(\'' + link + '\');">' + (p.length ? p.join('|') : link) + '</a>';
            }
        })
    ); 
}
    
})();

// from 140byt.es with url fixes (+ to * and / to -) by me.
function encode(str){
	var chrTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*-';
	var e = function(a,b,c,d,e){for(d=e='';a[d|0]||(b='=',d%1);e+=b[63&c>>8-d%1*8])c=c<<8|a.charCodeAt(d-=-.75);return e}
	var r =  e(str, chrTable, "=");
	return r;
}
function decode(str){
	var chrTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*-';
	var e = function(d,b,c,u,r,q,x){for(r=q=x='';c=d[x++];~c&&(u=q%4?u*64+c:c,q++%4)?r+=String.fromCharCode(255&u>>(-2*q&6)):0)c=b.indexOf(c);return r}
	var r = e(str,chrTable);
	return r;
}