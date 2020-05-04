/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api. 

  const res = await axios.get("http://api.tvmaze.com/search/shows", {params: {q : query}});

  let returnList = res.data.map(element => {
    let show = element.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : 'https://tinyurl.com/tv-missing'
        }
      })

  console.log(returnList);
  return returnList;

}

async function getBanner(aShow){
 
    const images = await axios.get(`http://api.tvmaze.com/shows/${aShow.id}/images`);
    //console.log(images);
    if(images.data.length > 0){
     aShow.image = images.data[0].resolutions.medium.url;
     //console.log(aShow.image)
    } else {
     aShow.image = 'https://tinyurl.com/tv-missing'
    }
    return aShow;
  }


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    //console.log(shows)
    
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class="card-img-top" src=${show.image}>
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes" data-toggle="modal" data-target="#episode">Get Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  //console.log(shows);

  populateShows(shows);
  // let buttons = $('.card-body button');

});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  let result = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(result);
  populateEpisodes(result.data)
  // TODO: return array-of-episode-info, as described in docstring above
}
// const episodes = $('#episodes-list');
// const episodesArea = $('#episodes-area')
const theMod = $('.modal');
const modBody = $('.modal-body');
function populateEpisodes(arr){
  modBody.empty();

  let returnList = arr.map(element => {
    return {
      season: element.season,
      name: element.name,
      number: element.number,
      image: element.image ? element.image.medium : 'https://tinyurl.com/tv-missing'
        }
      })

  returnList.forEach(element => {
    // const newLi = $(`
    // <li>Season:${element.season}, Episode:${element.number} \"${element.name}\"</li>
    //   `);
    const newPrev = $(`
         <div class="card">
           <div class="card-body">
           <img class="card-img-top" src=${element.image}>
             <h5 class="card-title">"${element.name}"</h5>
             <p class="card-text">Season ${element.season}, Episode ${element.number}</p>
             
           </div>
         </div>
    `);
    modBody.append(newPrev);  
  });
// episodesArea.css('display', 'block');
}


const buttons = $('#shows-list');
 buttons.on('click', function(e){
 e.preventDefault();
 if(e.target.classList.contains('get-episodes')){
  // console.log(e);
  // console.log(e.target)
  // console.log(e.target.parentNode)
  // console.log(e.target.parentNode.parentNode)
  // console.log(e.target.parentNode.parentNode.dataset)
  // console.log(e.target.parentNode.parentNode.dataset.)
  const id = e.target.parentNode.parentNode.dataset.showId
  getEpisodes(id);
  theMod.addClass('show');
 }
 })