(function() {

    var access_token = null,
        refresh_token = null;

    function spotifyListener() {
        let type = document.getElementById('top_type').value;
        let time_range = document.getElementById('top_time_range').value;
        let offset = document.getElementById('top_offset').value;
        let limit = document.getElementById('top_limit').value;
        let url = '';
        if(type !== 'recent played') {
            url = 'https://api.spotify.com/v1/me/top/' + type +'?'+'time_range='+time_range+'&limit='+limit+'&offset='+offset;
        } else {
            url = 'https://api.spotify.com/v1/me/player/recently-played?type=track' + '&limit='+limit;
        }

        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                response.most_played_type = type;
                response.time_range = time_range;
                if(type !== 'recent played') {
                    userArtistPlaceholder.innerHTML = userArtistTemplate(response);
                } else {
                    if(response.items) {
                        response.items.forEach(function (item) {
                            if(item.played_at) {
                                item.played_at = moment(item.played_at).format("DD.MM.YYYY HH:mm");
                            }
                        })
                    }
                    userRecentPlayedPlaceholder.innerHTML = userRecentPlayedTemplate(response);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("Status: " + textStatus); alert("Error: " + errorThrown);
            }
        });
    }

    Handlebars.registerHelper('if_eq', function(a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });

    Handlebars.registerHelper('add_offset', function(value, offset) {
        let resultoffset = parseInt(value) + parseInt(offset);
        return resultoffset;
    });

    Handlebars.registerHelper("inc", function(value, options)
    {
        return parseInt(value) + 1;
    });

    Handlebars.registerHelper("log", function(something) {
        console.log(something);
    });

    var userArtistSource = document.getElementById('user-artist-template').innerHTML,
        userArtistTemplate = Handlebars.compile(userArtistSource),
        userArtistPlaceholder = document.getElementById('top');

    var userRecentPlayedSource = document.getElementById('user-recent-template').innerHTML,
        userRecentPlayedTemplate = Handlebars.compile(userRecentPlayedSource),
        userRecentPlayedPlaceholder = document.getElementById('top');

    /*
    var params = getHashParams();
    var error = params.error;
    */

    $.ajax({
        url: '/tokens',
        success: function(response) {
            access_token = response.access_token;
            refresh_token = response.refresh_token;
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function() {
                    $('#login').hide();
                    $('#loggedin').show();
                    document.getElementById('top-played').addEventListener('click', spotifyListener, false);
                },
                error: function (response) {
                    $('#login').show();
                    $('#loggedin').hide();
                }
            });
        },
        error: function (response) {
            console.log(response);
        }
    });

})();
