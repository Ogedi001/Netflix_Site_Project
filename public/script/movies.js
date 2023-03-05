const inputs = document.querySelectorAll('#input'),
                movies = document.querySelector('.movies'),
                search_results = document.querySelector('#search-results')


            for (const input of inputs) {
                input.addEventListener('keyup', async (e) => {
                    movies.style.display = 'none'
                    search_results.style.display = 'block'

                    let search_term = inputs[0].value,
                        page = Number(inputs[1].value)

                    if (typeof page === 'undefined' || page < 1 || page == '') { page = 1 }


                    if (search_term.length == "" && page == 1) {

                        search_results.style.display = 'none';
                        movies.style.display = 'flex';
                    }
                    const url = `http://localhost:4000/search?q=${search_term}&page=${page}`
                    const response = await fetch(url)
                    const data = await response.json()


                    if (data.movies.length == 0) {
                        search_results.innerHTML = "<h2 class='fs-2 text-center'>No show found</h2>";
                        return;
                    }
                    search_results.innerHTML = ""
                    const newDiv = document.createElement('div')
                    newDiv.classList.add('row')

                    data.movies.forEach(movie => {
                        const newDivContent = `
                    <div class="col">
                        <a href="/movie?id=${movie.id} ">
                            <img src="${movie.image_thumbnail_path} " alt="Picture of ${movie.name} ">
                            <div class="brief">
                                <h2>${movie.name} </h2>
                                <h4>Country: ${movie.country} </h4>
                                <h4>Network: ${movie.network} </h4>
                            </div>
                        </a>
                    </div>
                `;
                        console.log('idd' + movie.id);
                        newDiv.innerHTML += newDivContent;
                    })

                    search_results.innerHTML = newDiv.outerHTML;
                })

            }

    