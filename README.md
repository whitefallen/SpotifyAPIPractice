Topsify!
-----
what has started as a hobby project to explore the Spotify API and Node.js. <br>
is now deployed to Heroku - <a href="https://spotifyranking.herokuapp.com/">Topsify</a> <br>

Usage
--
  <table class="ui black table">
      <thead>
      <tr><th>Option</th>
          <th>Value</th>
          <th>Description</th>
      </tr></thead><tbody>
  <tr>
      <td>Type</td>
      <td>artists or tracks</td>
      <td>Entity type to search for</td>
  </tr>
  <tr>
      <td>Time_range</td>
      <td>long_term , medium_term or short_term</td>
      <td>
          <div class="ui list">
              <div class="item">long_term - calculated from several years of data and including all new data as it becomes available</div>
              <div class="item">medium_term - approximately last 6 months</div>
              <div class="item">short_term - approximately last 4 weeks</div>
          </div>
      </td>
  </tr>
  <tr>
      <td>Limit</td>
      <td>Defaul:20. Minimum: 1. Maximum: 50. </td>
      <td>
          The number of entities to return.
      </td>
  </tr>
  <tr>
      <td>Offeset</td>
      <td>Default: 0 (i.e., the first track). Use with limit to get the next set of entities.</td>
      <td>
          The index of the first entity to return.
      </td>
  </tr>
  </tbody>
  </table>

Notes
--
used ressources
* Semantic UI
* Node.js

Made by Whitefallen
