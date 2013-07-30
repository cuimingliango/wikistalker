	
	$(document).ready(function() { 
	
	    var initTitle = getURLParameter('title')!='null' ?  getURLParameter('title') : 'borges';
	    var initRel = getURLParameter('rel')!='null' ?  getURLParameter('rel') : 0.5;
	    var initSort = getURLParameter('sort')!='null' ?  getURLParameter('sort') : 'title';
	    
	    $('#rel-val').text(initRel*100+'%');

	    $('#article').val(initTitle);
	    
	    if(initSort=='relatedness') {
	    
	        $('#sort-rel').attr('checked','checked');
	        $('#sort-title').removeAttr('checked');
	    }

	    

        var wikistalker = new Wikistalker({title: initTitle, container: '#d3', width: 800, height: 800, innerCircleR: 160, sortMethod :initSort, relevance_cutoff: initRel }); 

    
        $('#article').suggest({zIndex: 400, animate: true, xhr_delay : 500});
        
        $('#article').change(function() {
            setTimeout(function() {
                $('.small-svg').hide();
                $('.preview').hide();
                console.log($('#article').val().replace(/\ /g,'%2B'));
                wikistalker.changeArticle(null,$('#article').val().replace(/\ /g,'%2B'));
            },200);

        });
        
        $('#wiki_content .close').click(function() {
            $('#wiki_content').slideUp();
            return false;
        });
        



        
        $('#history-view').click(function() {
            wikistalker.makeHistory();
            $('.history-container').show();
            $(this).addClass('tab');
            $('#navigate-view').removeClass('tab');
            
        
        });

        $('#navigate-view').click(function() {
            
            $('.history-container').hide();
            $(this).addClass('tab');
            $('#history-view').removeClass('tab');
        
        });
    
        $("#rel-slider" ).slider({max: 100, value: initRel*100,min: 1, range: "max",
            slide: function(event, ui) {
                
                wikistalker.changeRelevanceCutoff(ui.value/100);
                $('#rel-val').text(ui.value+'%');
           }
        });
        
        $('#go-button').click(function() {
            wikistalker.changeArticle(null,$('#article').val().replace(/\ /g,'%2B'));
        });
        $('.radio').click(function() {

              wikistalker.changeSortMethod($(this).val());
        });
        
        $('#link-to-this').click(function() {

             var  link= 'http://sepans.com/wikistalker/?title='+$('#article').val().replace(/\ /g,'%2B')
                                    +'&rel='+($('#rel-slider').slider("option", "value")/100)
                                    +'&sort='+($('#sort-rel').attr('checked')=='checked' ? 'relatedness' : 'title');
             console.log(link);
             $('#link-to-this').attr('href',link);
             //window.open(url,'_blank');
            return confirm('link to this settings: \n '+link+'\n open it in a new tab?')
            //    window.open(url,'_blank');
                
         //   return false;
             
        });

        
        $('#article-view').click(function() {
            var id = $('#article-id').val();
            var url = '/proxy.php?proxy_url='+'http://en.wikipedia.org/w/api.php?action=query%26prop=revisions%26rvprop=content%26format=json%26pageids='+id;
            console.log(url);
            $('#wiki_content .wiki').html('');
            $('#wiki_content').show();
            $('#wiki_content .wiki').hide();
            $.getJSON(url, function(data) {
                
                var content = data.query.pages[id].revisions[0]['*'];
                var htmlOutput = content.wiki2html();
				var regex = /\{\{([^}]+)\}\}/g;
				//console.log( htmlOutput.replace(regex, ''));


				htmlOutput = htmlOutput.replace(regex, '');
				htmlOutput = htmlOutput.replace(/\|/g,'* ');

                $('#wiki_content .wiki').html(htmlOutput);

                $('#wiki_content .wiki a').click(function() {return false;});
                
                $('#wiki_content .wiki').slideDown();
                

            });
        });

    });
    
    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
        );
    }
    
