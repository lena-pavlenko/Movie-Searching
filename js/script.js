import { apiKey } from './config.js';

const service = {
    apiSource: 'https://api.kinopoisk.dev/v1.3/movie',
    limit: 12
}

async function getFilm(config, headers) {
    showPreloader()
    try {
        const response = await fetch(`${config.apiSource}?limit=${config.limit}`, {
            headers: headers
        })
        
        const data = await response.json()
        console.log(data);
        return data

    } catch (error) {
        console.log(error);
        throw error // или return Promise.reject()
    }
   
}
async function getFilmParam(config, params, headers) {
    showPreloader()
    try {
        const response = await fetch(`${config.apiSource}?limit=${config.limit}&${params.name}=${params.value}`, {
            headers: headers
        });
        
        const data = await response.json()
        return data

    } catch (error) {
        console.log(error);
        throw error // или return Promise.reject()
    }
   
}

const select = document.getElementById('yearSelect')
const container = document.querySelector('.container .row')
const form = document.forms['searchGenre']
const inputGenre = form.elements['search-genre']

function renderFilms(movies) {
    container.innerHTML = ''

    movies.forEach(movie => {
        container.insertAdjacentHTML('beforeend', renderTemplate(movie))
    });
}

function renderGenres(genres) {
    let strGenres = ''

    genres.forEach(genre => {
        if (!genre.name) return
        strGenres += genre.name + ', '
    })

    return strGenres = strGenres.slice(0, -2)
}

function renderTemplate(film) {
    const card = `
        <div class="col-sm-12 col-md-6 col-lg-3 mb-2">
            <div class="card">
                <div class="card__image">
                    <img src="${film.poster.url || ''}" class="card-img-top" alt="${film.name || ''}">
                </div>
                <div class="card-body">
                    <h4 class="card-title">${film.name || ''}</h4>
                    <p class="card-text font-weight-bold">${renderGenres(film.genres)}</p>
                    <p class="card-text">${film.shortDescription || ''}</p>
                </div>
                <div class="card-footer text-body-secondary">${film.year || ''}</div>
            </div>
        </div>
    `
    return card
}

function selectHandler() {
    const params = {
        value: select.value,
        name: select.name,
    }

    if (params.value === 'all') {
        getFilm(service, {
        'X-API-KEY': apiKey
    })
        .then(data => {
            if (!data.docs.length) {
                showAlarmMessage()
                return
            }
            removeAlarmMessage()
            removePreloader()
            renderFilms(data.docs)
        })
        .catch(err => {
            console.log(err)
            showAlarmMessage()
        })
    } else {
        getFilmParam(service, params, {
            'X-API-KEY': apiKey
        })
            .then(data => {
                if (!data.docs.length) {
                    showAlarmMessage()
                    return
                }
                removeAlarmMessage()
                removePreloader()
                renderFilms(data.docs)
            })
            .catch(err => {
                console.log(err)
                showAlarmMessage()
            })
    }
}

function searchHandler(e) {
    e.preventDefault();
    
    const valueGenre = inputGenre.value

    getFilmParam(service, 'genres.name', valueGenre, {
        'X-API-KEY': apiKey
    })
        .then(data => {
            if (!data.docs.length) {
                showAlarmMessage()
                return
            }
            removeAlarmMessage()
            removePreloader()
            renderFilms(data.docs)
        })
        .catch(err => {
            console.log(err)
            showAlarmMessage()
        })
}

function showPreloader() {
    document.body.insertAdjacentHTML('afterbegin',
    `<div class="progress">
        <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Подождите...</span>
        </div>
    </div> `)
}

function removePreloader() {
    if (document.querySelector('.progress')) {
        document.querySelector('.progress').remove()
    }
}

function showAlarmMessage(){
    container.insertAdjacentHTML('afterend', `
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="alarmToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Ошибка</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                Извините, ничего не найдено!
            </div>
        </div>
    </div>`)
}

function removeAlarmMessage() {
    if (document.querySelector('.toast-container')) {
        document.querySelector('.toast-container').remove()
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    getFilm(service, {
        'X-API-KEY': apiKey
    })
        .then(data => {
            if (!data.docs.length) {
                showAlarmMessage()
                return
            } 
            removePreloader()
            removeAlarmMessage()
            renderFilms(data.docs)
        })
        .catch(err => {
            console.log(err)
            showAlarmMessage()
        })

    select.addEventListener('change', selectHandler)

    form.addEventListener('submit', searchHandler)

    document.body.addEventListener('click', function(e){
        if (e.target.closest('.toast-container button')) {
            removePreloader()
        }
    })

})