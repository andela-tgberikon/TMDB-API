TMDB = {
        baseSearchMovie: "https://api.themoviedb.org/3/search/movie",
        base2: "https://api.themoviedb.org/3/movie/popular",
        baseUrl: "",
        youtubeUrl: "http://www.youtube.com/embed/",
        baseMovieTrailer:"https://api.themoviedb.org/3/movie/",
        params: {api_key: "fb5a22ba28e3a8b761c623cb071fa7a9" },
        page: 0,
        total_pages:0,
        movieID: "",

    start: function (){
            TMDB.popularMovies();
           $("#searchMoviesButton").click(TMDB.getSearch);
           $("#movieID").keydown(TMDB.enterKeyHandler);
           $("#geoLocation").hide();
           $('#backButton').click(TMDB.backButton);
           $("#iFrame").draggable();
           $('#viewTrailer, #viewTrailer2').click(TMDB.showTrailers);
           $('#backToReview').click(TMDB.showReviews);
        },

    //  This is for the back button to hide the emebed video and backdrop poster.
    backButton: function(){
        $('#currentMovies').show();
        $('#image').hide();
        $('#backButton').hide();
        $('#trailers').hide();
        $('#movieDescription').hide();
        $('#geoLocation').hide();
        $('#viewTrailer').show();
    },  

    //Function to handle request when user hits enter.
    enterKeyHandler: function(e) {
            if(e.which == 13){
                TMDB.getSearch(); 
            }
        },
        
    // Load popular MOvies        
    popularMovies: function(){
            TMDB.baseUrl = TMDB.base2;
            TMDB.params.query = "";
            TMDB.params.page = 1;
            TMDB.getMyMovies();
            $('#viewTrailer2').hide();   
        },
    
    // Get the keyword to search with.
    getSearch: function(){
            TMDB.baseUrl = TMDB.baseSearchMovie;
            var searchTerm = $("#movieID").val();
            TMDB.params.query = searchTerm;
            TMDB.params.page = 1;
            TMDB.getMyMovies();
            $("#movieID").val("");
        }, 

    // Use the search keyword to load movies.
    getMyMovies: function(){
            $.getJSON(TMDB.baseUrl, TMDB.params, function(items){
                    TMDB.loadMovies(items);
                });
            $("#currentMovies").empty();
            $('#backButton').hide();
            $('#viewTrailer2').hide();
        },
    
    // Function to display popular movies.   
     loadMovies: function(items) {
            TMDB.total_pages = items.total_pages;
		    TMDB.page = items.page;
		    if(items.results == ""){
		        $("#currentMovies").append('<img src='
                                            +'"img/error.jpg"'
                                            +"id='error'"
                                            +'/>');
		    }
		    $.each(items.results, function(i, movieData) {
    		   this.image = movieData.poster_path;
    		   if(this.image !== null){  //check to make sure each movie has a poster,
                                         //if it does, it displays it
    		                             // if it doesn't, it is removed from the list.
            		    $("#currentMovies").append('<li>'+'<p>'+ movieData.title +'</p>' 
            		    + "<a class=" + "clicked" + " href='#'><img src=" 
            		    + 'http://image.tmdb.org/t/p/w154/' //this is the url for the images, 
            		                                        //its separate from the base url, the w154 is the size,
            		    + movieData.poster_path
            		    + '?api_key=fb5a22ba28e3a8b761c623cb071fa7a9'
            		    +'/></a>'
            		    + '<p>Release Date:<br>'+movieData.release_date+'</p>' 
            		    +'<p class="backdrop">'+movieData.backdrop_path+'</p>'
            		    +'<p class="filmTitle">'+movieData.title+'</p>'
            		    +'<p class="filmId">'+movieData.id+'</p>'
            		    +'</li>');
                }else{
                    $(this).remove();
                        }
	        });
            $('#trailers').hide();
            TMDB.pagination();
            $('li a.clicked').click(function(e){
		        e.preventDefault();
		        var backdrop = $(this).siblings('.backdrop').text();
		        var filmTitle = $(this).siblings('.filmTitle').text();
		        TMDB.filmId = $(this).siblings('.filmId').text();
		        $('#image').attr('src', 'http://image.tmdb.org/t/p/w780/'+backdrop);
		        $('#movieDescription').html('<li><h2>'+filmTitle+'</h2></li>');
                $('#currentMovies').hide();
                $('#geoLocation').show();
                $('#movieDescription').show();
                $('#image').show();
                $('#backButton').show();
                $('#viewTrailer2').show();
                $('#backToReview').hide();
                TMDB.getMovieTrailer();
		    });
	    },

    // API call to get trailers for specified movie
    getMovieTrailer:function(){
            $.getJSON(TMDB.baseMovieTrailer + TMDB.filmId +'/trailers', TMDB.params, function(trailers){
                    TMDB.loadMovieTrailer(trailers);
                    TMDB.getMovieReviews();
                });
    },

    // function call to get trailers for specified movie
    loadMovieTrailer:function(trailers){
        TMDB.youtubeID = trailers.youtube[0].source; 
        $('#trailers').attr('src', TMDB.youtubeUrl+trailers.youtube[0].source);
    },

    showTrailers:function(e){
                e.preventDefault();
                $('#image').hide();
                $('#reviews').hide();
                $('#trailers').slideDown();
                $('#backToReview').show();
                $('#viewTrailer, #viewTrailer2').hide();
           },

    showReviews: function(e){
                e.preventDefault();
                $('#trailers').slideUp();
                $('.reviews').show();
                $('#viewTrailer, #viewTrailer2').show();
                $('#backToReview').hide();
    },

    getMovieReviews: function(){
            $.getJSON(TMDB.baseMovieTrailer + TMDB.filmId +'/reviews', TMDB.params, function(reviews){
                    TMDB.loadMovieReviews(reviews);
                });
    },

    loadMovieReviews:function(reviews){
            for(var i = 0; i < reviews.results.length; i++){
                $('#reviews').append('<li><p>'+reviews.results[i].content+'</p></li>');
                //console.log(reviews.results[i].content);
            }
    },

    // Handle page navigation for items loaded    
    pagination: function() {
            $('#compact-pagination').pagination({
            	pages: TMDB.total_pages,
            	currentPage: TMDB.page,
            	cssStyle: 'compact-theme',
            	displayedPages: 7,
            	onPageClick: function(page){
            	    TMDB.params.page = page;
            	    TMDB.getMyMovies();
            	}
            });
            $('#currentMovies').show();
            $('.reviews').hide();
        }
}
TMDB.start();
