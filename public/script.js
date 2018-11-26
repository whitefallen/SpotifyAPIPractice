(function() {

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
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

    var userArtistSource = document.getElementById('user-artist-template').innerHTML,
        userArtistTemplate = Handlebars.compile(userArtistSource),
        userArtistPlaceholder = document.getElementById('top');

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function() {
                    $('#login').hide();
                    $('#loggedin').show();
                }
            });
        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
        }

        document.getElementById('top-played').addEventListener('click', function() {
            let type = document.getElementById('top_type').value;
            let time_range = document.getElementById('top_time_range').value;
            let offset = document.getElementById('top_offset').value;
            let limit = document.getElementById('top_limit').value;
            let url = 'https://api.spotify.com/v1/me/top/' + type +'?'+'time_range='+time_range+'&limit='+limit+'&offset='+offset;
            $.ajax({
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    console.log(response);
                    response.most_played_type = type;
                    response.time_range = time_range;
                    userArtistPlaceholder.innerHTML = userArtistTemplate(response);
                }
            });
        }, false);
    }
})();
