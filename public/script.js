(function() {

    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }
    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    function spotifyListener() {
        let type = document.getElementById('top_type').value;
        let time_range = document.getElementById('top_time_range').value;
        let offset = document.getElementById('top_offset').value;
        let limit = document.getElementById('top_limit').value;
        let url = '';
        if(type === 'genres') {
          url = 'https://api.spotify.com/v1/me/top/' + 'artists' +'?'+'time_range='+time_range+'&limit='+limit+'&offset='+offset;
        }
        if(type === 'artists' || type === 'tracks') {
            url = 'https://api.spotify.com/v1/me/top/' + type +'?'+'time_range='+time_range+'&limit='+limit+'&offset='+offset;
        } else if(type === 'recent played') {
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
                if(type === 'genres' ) {
                  let genresRes = response.items.map(item => item.genres);
                  let genresArr = [];
                  genresRes.forEach((genreSet => {
                    genreSet.forEach(genreEntity => {
                      let findGenre = genresArr.find(element => element.name === genreEntity);
                      if(findGenre) {
                        findGenre.amount +=1
                      } else {
                        genresArr.push({name: genreEntity, amount: 1})
                      }
                    })
                  }))

                  genresArr.sort((entryA, entryB) => entryB.amount - entryA.amount)
                  let highest = genresArr[0];
                  genresArr.forEach((entry) => {
                    entry.percent = entry.amount / highest.amount * 100;
                  })
                  response.genresDistribution = genresArr;
                  userGenreDistributionPlaceholder.innerHTML = userGenreDistributionTemplate(response);
                }
                if(type === 'artists' || type === 'tracks') {
                    userArtistPlaceholder.innerHTML = userArtistTemplate(response);
                } else if(type === 'recent played') {
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
        return null;
    });

    let userArtistSource = document.getElementById('user-artist-template').innerHTML,
        userArtistTemplate = Handlebars.compile(userArtistSource),
        userArtistPlaceholder = document.getElementById('top');

    let userRecentPlayedSource = document.getElementById('user-recent-template').innerHTML,
        userRecentPlayedTemplate = Handlebars.compile(userRecentPlayedSource),
        userRecentPlayedPlaceholder = document.getElementById('top');

    let userGenreDistributionSource = document.getElementById('user-genre-distribution-template').innerHTML,
        userGenreDistributionTemplate = Handlebars.compile(userGenreDistributionSource),
        userGenreDistributionPlaceholder = document.getElementById('top');

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

})();
