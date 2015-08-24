var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

items_per_page = 10;
posters = [];


$(document).ready(function () {


    if (isMobile.any()) {
        //some code...
        items_per_page = 5;
    }


    var $container = $('.posters');

    // var container = document.querySelector('#container');
    // $container.masonry({
    // itemSelector: '.poster'
    // });
    var posters = [];

    $.getJSON('/js/posters.json', function (data) {
        posters = data.posters;
        var $firstPosters = getNewItems(posters, 0, items_per_page);

        $('<div></div>').append($firstPosters).imagesLoaded(function () {
            // console.log("Load: " + "0" + " " + items_per_page);
            $container.append($firstPosters).masonry({
                itemSelector: '.poster'
            });



            // $('.posters').imagesloaded(function () {
            $container.infiniteScrollHelper({
                bottomBuffer: 100,
                loadMoreDelay: 100,
                triggerInitialLoad: false,
                loadMore: function (page, done) {
                    $('#footer').show();

                    // you should use the page argument to either select an anchor/href and load 
                    // the contents of that url or make a call to an API that accepts a page number
                    // console.log("Loading more...")


                    var startLoop = ((page - 1) * items_per_page);
                    var endLoop = Math.min((page * items_per_page), posters.length);

                    // console.log("Load: " + startLoop + " " + endLoop);
                    var $newItems = getNewItems(posters, startLoop, endLoop);

                    $('<div></div>').append($newItems).imagesLoaded(function () {


                        setTimeout(function () {
                            $('#footer').fadeOut(100);
                            // console.log("Done.");
                            $container.append($newItems).masonry('appended', $newItems);
                        }, 250);
                    });

                    done();

                }
            });
        });
    });

});

getNewItems = function (source, start, end) {
    var newItems = [];

    for (var i = start; i < end; i++) {
        newItems.push(getPoster(source[i]));
    }

    return newItems;
}

getPoster = function (poster) {
    var d = document.createElement('div');
    $(d).addClass('poster')
        .html("<img src=\"img/jpg/" + poster + "\" />");
    return d;
}