	var def_name="Welcome";
	var server="http://localhost/server.php";//url or false
	var server_id="c1ee33b7fb8c0cab957515a6dc9f319f"; //ask on server
	var table="wiki"; //in localStorage
	var saving=true;
	function tc(us){
		if(typeof(us)=='number'&&parseInt(us)==us){
		var a = new Date(us);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time = date+' '+month+' '+year+' '+hour+':'+min+':'+sec ;
		return time;
		}else{time=us;}
	}
	function $(id){return document.getElementById(id);}
	function get(url){var script = document.createElement("script"); script.type  = "text/javascript"; script.src = url; document.body.appendChild(script);}
	var wiki={
		nowWelcome:0, nowEdit:0,nowWatching:"",
		load: function (){
			if(localStorage.getItem(table)!==""){
				this.content=JSON.parse(localStorage.getItem(table));
			}else{
				this.content=Array({title:def_name,time:new Date().getTime(),text:"Hello, this is a NoteJS v 0.2.\nSimple wiki+html syntax support html5 (localStorage) based notebook.\nYou can not delete or rename this start page. Just edit.\nAuthor: Hormold (Nikita A.) - [http://about.hormold.ru]\n"});
				localStorage.setItem(table+"_lang","all");
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
			if(!num.time){num.time="Infinity Ago";}
			if(typeof(num.time)=='number'&&parseInt(num.time)==num.time){num.time=tc(num.time);}
			if(num.title!=def_name){button="<a title='Delete' href='javascript:wiki.delete(\"<%= title %>\");'>(X)</a>";}else{button='';}
			lang=localStorage.getItem(table+"_lang");
			text=num.text;
			if(lang=="wiki" || lang==""){text=num.text.wiki2html();}
			if(lang=="md"){text=converter.makeHtml(num.text);}
			//if(lang=="all"){text=converter.makeHtml(num.text);text=text.wiki2html();}
			//text=converter.makeHtml(num.text);//num.text.wiki2html();
			var tpl="<div id='wiki'><div id='title'>"+num.title+"<span id='buttons'>"+button+" <a href='javascript:wiki.edit(\""+num.title+"\");' title='Edit page'>(E)</a></span></div><div id='time'>Last modified: "+num.time+"</div><div id='text'>"+text+"</div></div>";
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
		
		options: function(){
			opt="<li><a href='javascript:utils.backup_server();'>Backup to server</a></li>";
			opt+="<li><a href='javascript:utils.import_server();'>Import from Server (reload page)</a></li>";
			opt+="<li><a href='javascript:utils.clear();'>Clear database (reload page)</a></li>";
			opt+="<li><a href='javascript:utils.lang(\"md\");'>Markdown support only (reload page)</a></li>";
			opt+="<li><a href='javascript:utils.lang(\"wiki\");'>Wiki support only (reload page)</a></li>";
			//opt+="<li><a href='javascript:utils.lang(\"all\");'>Wiki+Markdown supports (reload page)</a></li>";
			arr={title:"Options",text:"<ul style='font-size:120%'>"+opt+"</ul>"};
			out=wiki.make(arr);
			$("wiki").innerHTML=out;
		},
		
		lang: function(lang){
			ltable=table+"_lang";
			localStorage.setItem(ltable,lang);
			wiki.save();
			location.href=location.href;
		},
		
		clear: function(){
			if(prompt("Type 'YES' (case sensitive)")=="YES"){
				localStorage.setItem(table,"");
				saving=false;
				location.href=location.href;
			}
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
		
		.replace(/{{(.*?)}}/g, function (m, l) { // img_1
            return '<img src="' + l + '" />';
        })	
		
		.replace(/\[\[Image:(.*?)\]\]/g, function (m, l) { // italic
            return '<img src="' + l + '" />';
        })	
    
        /*.replace(/[^\[](http[^\[\s]*)/g, function (m, l) { // normal link
            return '<a href="' + l + '">' + l + '</a>';
        })*/
    
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

//Showdown - Markdown parser (C)  https://github.com/arzynik/showdown
var Showdown={};Showdown.converter=function(){var g_urls;var g_titles;var g_html_blocks;var g_print_refs;var g_print_refs_count;var g_list_level=0;var config=this.config={stripHTML:false,headerautoid:false,tables:false,math:false,figures:false,refprint:false,github_flavouring:false,additional_parser:false};if(arguments[0]){for(x in arguments[0]){this.config[x]=arguments[0][x]}}this.makeHtml=function(text){g_urls=new Array();g_titles=new Array();g_html_blocks=new Array();g_print_refs={};g_print_refs_count=0;text=text.replace(/~/g,"~T");text=text.replace(/\$/g,"~D");text=text.replace(/\r\n/g,"\n");text=text.replace(/\r/g,"\n");text="\n\n"+text+"\n\n";text=_Detab(text);text=text.replace(/^[ \t]+$/mg,"");text=_HashHTMLBlocks(text);text=_StripLinkDefinitions(text);text=_RunBlockGamut(text);text=_UnescapeSpecialChars(text);text=text.replace(/~D/g,"$$");text=text.replace(/~T/g,"~");if(config.stripHTML){text=stripUnwantedHTML(text)}if(config.refprint&&g_print_refs_count){var link_table='<ul class="reflist print">';for(i in g_print_refs){link_table+="<li>["+g_print_refs[i]+"]: "+i+"</li>"}link_table+="</ul>";text+=link_table}if(typeof config.additional_parser=="function"){text=config.additional_parser(text)}return text};var _StripLinkDefinitions=function(text){var text=text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,function(wholeMatch,m1,m2,m3,m4){m1=m1.toLowerCase();g_urls[m1]=_EncodeAmpsAndAngles(m2);if(m3){return m3+m4}else{if(m4){g_titles[m1]=m4.replace(/"/g,"&quot;")}}return""});return text};var _HashHTMLBlocks=function(text){text=text.replace(/\n/g,"\n\n");var block_tags_a="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del";var block_tags_b="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";text=text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,hashElement);text=text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,hashElement);text=text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,hashElement);text=text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,hashElement);text=text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,hashElement);text=text.replace(/\n\n/g,"\n");return text};var hashElement=function(wholeMatch,m1){var blockText=m1;blockText=blockText.replace(/\n\n/g,"\n");blockText=blockText.replace(/^\n/,"");blockText=blockText.replace(/\n+$/g,"");blockText="\n\n~K"+(g_html_blocks.push(blockText)-1)+"K\n\n";return blockText};var _RunBlockGamut=function(text){text=_DoHeaders(text);text=text.replace(/\\([\|])/g,escapeCharacters_callback);if(config.tables){text=_DoTables(text)}var key=hashBlock("<hr />");text=text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,key);text=text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,key);text=text.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,key);text=_DoLists(text);text=_DoCodeBlocks(text);text=_DoBlockQuotes(text);text=_HashHTMLBlocks(text);text=_FormParagraphs(text);return text};var _RunSpanGamut=function(text){text=_DoCodeSpans(text);text=_EscapeSpecialCharsWithinTagAttributes(text);text=_EncodeBackslashEscapes(text);text=_DoImages(text);text=_DoAnchors(text);text=_DoAutoLinks(text);text=_EncodeAmpsAndAngles(text);text=_DoTextStyle(text);text=text.replace(/  +\n/g," <br />\n");return text};var _EscapeSpecialCharsWithinTagAttributes=function(text){var regex=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;text=text.replace(regex,function(wholeMatch){var tag=wholeMatch.replace(/(.)<\/?code>(?=.)/g,"$1`");tag=escapeCharacters(tag,"\\`*_");return tag});return text};var _DoAnchors=function(text){text=text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeAnchorTag);text=text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:[^\(]*?\([^\)]*?\)\S*?)|(?:.*?))>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeAnchorTag);text=text.replace(/(\[([^\[\]]+)\])()()()()()/g,writeAnchorTag);return text};var writeAnchorTag=function(wholeMatch,m1,m2,m3,m4,m5,m6,m7){if(m7==undefined){m7=""}var whole_match=m1;var link_text=m2;var link_id=m3.toLowerCase();var url=m4;var title=m7;if(url==""){if(link_id==""){link_id=link_text.toLowerCase().replace(/ ?\n/g," ")}url="#"+link_id;if(g_urls[link_id]!=undefined){url=g_urls[link_id];if(g_titles[link_id]!=undefined){title=g_titles[link_id]}}else{if(whole_match.search(/\(\s*\)$/m)>-1){url=""}else{return whole_match}}}url=escapeCharacters(url,"*_");var result='<a href="'+url+'"';if(title!=""){title=title.replace(/"/g,"&quot;");title=escapeCharacters(title,"*_");result+=' title="'+title+'"'}result+=">"+link_text+"</a>";if(config.refprint){if(!g_print_refs[url]){g_print_refs[url]=++g_print_refs_count}result+='<span class="linkref print">~E91E'+g_print_refs[url]+"~E93E</span>"}return result};var _DoImages=function(text){text=text.replace(/(![<>]?\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeImageTag);text=text.replace(/(![<>]?\[(.*?)\]\s?\([ \t]*()<?((?:[^\(]*?\([^\)]*?\)\S*?)|(?:\S*?))>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeImageTag);return text};var writeImageTag=function(wholeMatch,m1,m2,m3,m4,m5,m6,m7){var whole_match=m1;var alt_text=m2;var link_id=m3.toLowerCase();var url=m4;var title=m7;if(!title){title=""}if(url==""&&link_id!==""){if(g_urls[link_id]!=undefined){url=g_urls[link_id];if(g_titles[link_id]!=undefined){title=g_titles[link_id]}else{title=undefined}}}var figure=false,match;if(match=whole_match.match(/^!([<>])/)){if(match[1]===">"){figure="right"}else{if(match[1]==="<"){figure="left"}}}alt_text=alt_text.replace(/"/g,"&quot;");url=escapeCharacters(url,"*_");var result='<img src="'+url+'" alt="'+alt_text+'"';if(title!==undefined){title=title.replace(/"/g,"&quot;");title=escapeCharacters(title,"*_");result+=' title="'+title+'"'}result+=" />";if(config.figures&&figure!==false){if(title===undefined||title===""){result='<div class="figure '+figure+'">\n  '+result+"\n</div>"}else{result='<div class="figure '+figure+'">\n  '+result+"<br/>\n  <span>"+title+"</span>\n</div>"}}return result};var _DoHeaders=function(text){text=text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(wholeMatch,m1){if(config.headerautoid){return hashBlock('<h1 id="'+headerId(m1)+'">'+_RunSpanGamut(m1)+"</h1>")}else{return hashBlock("<h1>"+_RunSpanGamut(m1)+"</h1>")}});text=text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(matchFound,m1){if(config.headerautoid){return hashBlock('<h2 id="'+headerId(m1)+'">'+_RunSpanGamut(m1)+"</h2>")}else{return hashBlock("<h2>"+_RunSpanGamut(m1)+"</h2>")}});text=text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(wholeMatch,m1,m2){var h_level=m1.length;if(config.headerautoid){return hashBlock("<h"+h_level+' id="'+headerId(m2)+'">'+_RunSpanGamut(m2)+"</h"+h_level+">")}else{return hashBlock("<h"+h_level+">"+_RunSpanGamut(m2)+"</h"+h_level+">")}});function headerId(m){return m.replace(/[^\w]/g,"").toLowerCase()}return text};var _ProcessListItems;var _DoLists=function(text){text+="~0";var whole_list=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;if(g_list_level){text=text.replace(whole_list,function(wholeMatch,m1,m2){var list=m1;var list_type=(m2.search(/[*+-]/g)>-1)?"ul":"ol";list=list.replace(/\n{2,}/g,"\n\n\n");var result=_ProcessListItems(list);result=result.replace(/\s+$/,"");result="<"+list_type+">\n"+result+"</"+list_type+">\n";return result})}else{whole_list=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;text=text.replace(whole_list,function(wholeMatch,m1,m2,m3){var runup=m1;var list=m2;var list_type=(m3.search(/[*+-]/g)>-1)?"ul":"ol";var list=list.replace(/\n{2,}/g,"\n\n\n");var result=_ProcessListItems(list);result=runup+"<"+list_type+">\n"+result+"</"+list_type+">\n";return result})}text=text.replace(/~0/,"");return text};_ProcessListItems=function(list_str){g_list_level++;list_str=list_str.replace(/\n{2,}$/,"\n");list_str+="~0";list_str=list_str.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(wholeMatch,m1,m2,m3,m4){var item=m4;var leading_line=m1;var leading_space=m2;if(leading_line||(item.search(/\n{2,}/)>-1)){item=_RunBlockGamut(_Outdent(item))}else{item=_DoLists(_Outdent(item));item=item.replace(/\n$/,"");item=_RunSpanGamut(item)}return"<li>"+item+"</li>\n"});list_str=list_str.replace(/<\/li></g,"</li>\n<");list_str=list_str.replace(/~0/g,"");g_list_level--;return list_str};var _DoCodeBlocks=function(text){text+="~0";if(config.github_flavouring){text=text.replace(/\n```([a-zA-Z]+)?\s*\n((?:.*\n+)+?)(\n*```|(?=~0))/g,function(wholeMatch,m1,m2){var codeblock=_EncodeCode(m2);codeblock=_Detab(codeblock);codeblock=codeblock.replace(/^\n+/g,"");codeblock=codeblock.replace(/\n+$/g,"");if(m1){codeblock='<pre><code class="'+m1+'">'+codeblock+"\n</code></pre>"}else{codeblock="<pre><code>"+codeblock+"\n</code></pre>"}return hashBlock(codeblock)})}text=text.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(wholeMatch,m1,m2){var codeblock=m1;var nextChar=m2;codeblock=_EncodeCode(_Outdent(codeblock));codeblock=_Detab(codeblock);codeblock=codeblock.replace(/^\n+/g,"");codeblock=codeblock.replace(/\n+$/g,"");codeblock="<pre><code>"+codeblock+"\n</code></pre>";return hashBlock(codeblock)+nextChar});text=text.replace(/~0/,"");return text};var hashBlock=function(text){text=text.replace(/(^\n+|\n+$)/g,"");return"\n\n~K"+(g_html_blocks.push(text)-1)+"K\n\n"};var _DoCodeSpans=function(text){text=text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(wholeMatch,m1,m2,m3,m4){var c=m3;c=c.replace(/^([ \t]*)/g,"");c=c.replace(/[ \t]*$/g,"");c=_EncodeCode(c);return m1+"<code>"+c+"</code>"});if(config.math){text=text.replace(/(^|[^\\])(%%)([^\r]*?[^%])\2(?!%)/gm,function(wholeMatch,m1,m2,m3,m4){var c=m3;c=c.replace(/^([ \t]*)/g,"");c=c.replace(/[ \t]*$/g,"");c=_EncodeCode(c);return m1+'<span class="mathInline">%%'+c+"%%</span>"});text=text.replace(/(^|[^\\])(~D~D)([^\r]*?[^~])\2(?!~D)/gm,function(wholeMatch,m1,m2,m3,m4){var c=m3;c=c.replace(/^([ \t]*)/g,"");c=c.replace(/[ \t]*$/g,"");c=_EncodeCode(c);return m1+'<span class="math">~D~D'+c+"~D~D</span>"})}return text};var _EncodeCode=function(text){text=text.replace(/&/g,"&amp;");text=text.replace(/</g,"&lt;");text=text.replace(/>/g,"&gt;");text=text.replace(/~E124E/g,"\\|");text=escapeCharacters(text,"*_{}[]\\",false);return text};var _DoTextStyle=function(text){text=text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>");if(config.github_flavouring){text=text.replace(/(\w)_(\w)/g,"$1~E95E$2")}text=text.replace(/(~T~T)(?=\S)([^\r]*?\S[*_]*)\1/g,"<del>$2</del>");text=text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>");return text};var _DoBlockQuotes=function(text){text=text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(wholeMatch,m1){var bq=m1;bq=bq.replace(/^[ \t]*>[ \t]?/gm,"~0");bq=bq.replace(/~0/g,"");bq=bq.replace(/^[ \t]+$/gm,"");bq=_RunBlockGamut(bq);bq=bq.replace(/(^|\n)/g,"$1  ");bq=bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(wholeMatch,m1){var pre=m1;pre=pre.replace(/^  /mg,"~0");pre=pre.replace(/~0/g,"");return pre});return hashBlock("<blockquote>\n"+bq+"\n</blockquote>")});return text};var _FormParagraphs=function(text){text=text.replace(/^\n+/g,"");text=text.replace(/\n+$/g,"");var grafs=text.split(/\n{2,}/g);var grafsOut=new Array();var end=grafs.length;for(var i=0;i<end;i++){var str=grafs[i];if(str.search(/~K(\d+)K/g)>=0){grafsOut.push(str)}else{if(str.search(/\S/)>=0){str=_RunSpanGamut(str);if(config.github_flavouring){str=str.replace(/\n/g,"<br />")}str=str.replace(/^([ \t]*)/g,"<p>");str+="</p>";grafsOut.push(str)}}}end=grafsOut.length;for(var i=0;i<end;i++){while(grafsOut[i].search(/~K(\d+)K/)>=0){var blockText=g_html_blocks[RegExp.$1];blockText=blockText.replace(/\$/g,"$$$$");grafsOut[i]=grafsOut[i].replace(/~K\d+K/,blockText)}}return grafsOut.join("\n\n")};var _EncodeAmpsAndAngles=function(text){text=text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");text=text.replace(/<(?![a-z\/?\$!])/gi,"&lt;");return text};var _EncodeBackslashEscapes=function(text){text=text.replace(/\\(\\)/g,escapeCharacters_callback);text=text.replace(/\\([`*_{}\[\]()>#+-.!])/g,escapeCharacters_callback);return text};var _DoAutoLinks=function(text){text=text.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,'<a href="$1">$1</a>');text=text.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(wholeMatch,m1){return _EncodeEmailAddress(_UnescapeSpecialChars(m1))});return text};var _EncodeEmailAddress=function(addr){function char2hex(ch){var hexDigits="0123456789ABCDEF";var dec=ch.charCodeAt(0);return(hexDigits.charAt(dec>>4)+hexDigits.charAt(dec&15))}var encode=[function(ch){return"&#"+ch.charCodeAt(0)+";"},function(ch){return"&#x"+char2hex(ch)+";"},function(ch){return ch}];addr="mailto:"+addr;addr=addr.replace(/./g,function(ch){if(ch=="@"){ch=encode[Math.floor(Math.random()*2)](ch)}else{if(ch!=":"){var r=Math.random();ch=(r>0.9?encode[2](ch):r>0.45?encode[1](ch):encode[0](ch))}}return ch});addr='<a href="'+addr+'">'+addr+"</a>";addr=addr.replace(/">.+:/g,'">');return addr};var _UnescapeSpecialChars=function(text){text=text.replace(/~E(\d+)E/g,function(wholeMatch,m1){var charCodeToReplace=parseInt(m1);return String.fromCharCode(charCodeToReplace)});return text};var _Outdent=function(text){text=text.replace(/^(\t|[ ]{1,4})/gm,"~0");text=text.replace(/~0/g,"");return text};var _Detab=function(text){text=text.replace(/\t(?=\t)/g,"    ");text=text.replace(/\t/g,"~A~B");text=text.replace(/~B(.+?)~A/g,function(wholeMatch,m1,m2){var leadingText=m1;var numSpaces=4-leadingText.length%4;for(var i=0;i<numSpaces;i++){leadingText+=" "}return leadingText});text=text.replace(/~A/g,"    ");text=text.replace(/~B/g,"");return text};var escapeCharacters=function(text,charsToEscape,afterBackslash){var regexString="(["+charsToEscape.replace(/([\[\]\\])/g,"\\$1")+"])";if(afterBackslash){regexString="\\\\"+regexString}var regex=new RegExp(regexString,"g");text=text.replace(regex,escapeCharacters_callback);return text};var doTrim=function(str){if(str.trim!==undefined){return str.trim()}else{if(typeof jQuery!=="undefined"){return $.trim(str)}else{return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}}};var escapeCharacters_callback=function(wholeMatch,m1){var charCodeToEscape=m1.charCodeAt(0);return"~E"+charCodeToEscape+"E"};var _DoTables=function(text){text=text.replace(/^[ ]{0,3}[|](.+)\n[ ]{0,3}[|]([ ]*[-:]+[-| :]*)\n(((?=([ ]*[|].*\n))(?:[ ]*[|].*\n))*)(?=\n)/gm,_doTable_leadingPipe_callback);text=text.replace(/^[ ]{0,3}(\S.*[|].*)\n[ ]{0,3}([ ]*[-:]+[-| :]*)\n(((?=(.*[|].*\n))(?:.*[|].*\n))*)(?=\n)/gm,_doTable_callback);return text};var _doTable_leadingPipe_callback=function(){var content=arguments[3];content=content.replace(/^[ ]*[|]/gm,"");return _doTable_callback(arguments[0],arguments[1],arguments[2],content)};var _doTable_callback=function(){var head=arguments[1];var underline=arguments[2];var content=arguments[3];head=head.replace(/[|][ ]*$/gm,"\n");underline=underline.replace(/[|][ ]*\n/gm,"\n");content=doTrim(content.replace(/[|][ ]*\n/gm,"\n"));var separators=underline.split(/[ ]*[|][ ]*/);var attr={};for(var i=0,len=separators.length;i<len;++i){if(separators[i].match(/^[ ]*[-]+:[ ]*$/)){attr[i]=' align="right"'}else{if(separators[i].match(/^[ ]*:[-]+:[ ]*$/)){attr[i]=' align="center"'}else{if(separators[i].match(/^[ ]*:[-]+[ ]*$/)){attr[i]=' align="left"'}else{attr[i]=""}}}}var headers=head.split(/[ ]*[|][ ]*/);var col_count=headers.length;var text="<table>\n";text+="<thead>\n";text+="<tr>\n";for(var i=0;i<col_count;++i){text+="  <th"+attr[i]+">"+_RunSpanGamut(doTrim(headers[i]))+"</th>\n"}text+="</tr>\n";text+="</thead>\n";var rows=content.split(/\n/);text+="<tbody>\n";for(var i=0,len=rows.length;i<len;++i){var row_cells=rows[i].split(/[ ]*[|][ ]*/);text+="<tr>\n";for(var j=0,len2=row_cells.length;j<len2;++j){text+="  <td"+attr[j]+">"+_RunSpanGamut(doTrim(row_cells[j]))+"</td>\n"}text+="</tr>\n"}text+="</tbody>\n";text+="</table>";return text}};var stripUnwantedHTML=function(html){var allowedTags=arguments[1]||"a|b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|h4|h5|h6|i|img|li|ol|p|pre|sup|sub|strong|strike|ul|br|hr|span|table|th|tr|td|tbody|thead|tfoot|div",allowedAttributes=arguments[2]||{img:"src|width|height|alt",a:"href","*":"title",span:"class",tr:"rowspan",td:"colspan|align",th:"rowspan|align",div:"class",code:"class"},forceProtocol=arguments[3]||true;testAllowed=new RegExp("^("+allowedTags.toLowerCase()+")$"),findTags=/<(\/?)\s*([\w:\-]+)([^>]*)>/g,findAttribs=/(\s*)([\w:-]+)\s*=\s*(?:(?:(["'])([^\3]+?)(?:\3))|([^\s]+))/g;for(var i in allowedAttributes){if(allowedAttributes.hasOwnProperty(i)&&typeof allowedAttributes[i]==="string"){allowedAttributes[i]=new RegExp("^("+allowedAttributes[i].toLowerCase()+")$")}}return html.replace(findTags,function(original,lslash,tag,params){var tagAttr,wildcardAttr,rslash=params.substr(-1)=="/"&&"/"||"";tag=tag.toLowerCase();if(!tag.match(testAllowed)){return""}else{tagAttr=tag in allowedAttributes&&allowedAttributes[tag];wildcardAttr="*" in allowedAttributes&&allowedAttributes["*"];if(!tagAttr&&!wildcardAttr){return"<"+lslash+tag+rslash+">"}params=params.trim();if(rslash){params=params.substr(0,params.length-1)}params=params.replace(findAttribs,function(original,space,name,quot,value){name=name.toLowerCase();if(!value&&!quot){value="";quot='"'}else{if(!value){value=quot;quot='"'}}if((name=="href"||name=="src")&&(value.trim().substr(0,"javascript:".length)=="javascript:"||(name=="href"&&value.trim().substr(0,"data:".length)=="data:"))){value="#"}if(forceProtocol&&(name=="href"||name=="src")&&!/^[a-zA-Z]{3,5}:\/\//.test(value)&&(value.length<8&&value.trim().substr(0,"&#x6D;&#97;&#105;&#108;&#116;&#111;:".length)=="&#x6D;&#97;&#105;&#108;&#116;&#111;:")){value="http://"+value}if((wildcardAttr&&name.match(wildcardAttr))||(tagAttr&&name.match(tagAttr))){return space+name+"="+quot+value+quot}else{return""}});return"<"+lslash+tag+(params?" "+params:"")+rslash+">"}})};if(typeof exports!="undefined"){exports.Showdown=Showdown};
var converter = new Showdown.converter({
    'github_flavouring': true,
    'tables': true
});