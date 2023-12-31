import { apiKey } from './config.js';

import renderPages from './pagination.js';

const service = {
    apiSource: 'https://api.kinopoisk.dev/v1.3/movie',
    limit: 20,
    page: 1,
}

const params = {}

async function getFilm() {
    showPreloader()
    let paramsStr = ''
    try {
        const keys = Object.keys(params)
        if (keys.length > 0) {
            keys.forEach(key => {
                if (params[key].name && params[key].value) {
                    paramsStr += `&${params[key].name}=${params[key].value}`
                }
            })
        }
        const response = await fetch(`${service.apiSource}?limit=${service.limit}&page=${service.page}${paramsStr}`, {
            headers: {
                'X-API-KEY': apiKey
            }
        })
        
        const data = await response.json()
        return data

    } catch (error) {
        console.log(error);
        throw error 
    }
   
}

const select = document.getElementById('yearSelect')
const container = document.querySelector('.container .row')
const form = document.forms['searchGenre']
const inputGenre = form.elements['search-genre']
const paginationContainer = document.querySelector('.pagination')

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
                    <img src="${film.poster?.url || 'https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg'}" class="card-img-top" 
                    alt="${film.name || film.alternativeName || ''}">
                </div>
                <div class="card-body">
                    <h4 class="card-title">${film.name || film.alternativeName || 'Данные отсутствуют'}</h4>
                    <p class="card-text fw-medium">${renderGenres(film.genres)}</p>
                    <p class="card-text">${film.shortDescription || ''}</p>
                </div>
                <div class="card-footer text-body-secondary">${film.year || ''}</div>
            </div>
        </div>
    `
    return card
}

function selectHandler() {
    params.select = {
        name: select.name,
        value: select.value
    }
    service.page = 1

    if (select.value === 'all') {
        params.select = {}
        getFilm()
        .then(data => {
            renderPages(data.pages, service.page, paginationContainer)
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
        getFilm()
            .then(data => {
                renderPages(data.pages, service.page, paginationContainer)
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
    params.search = {
        name: 'genres.name',
        value: inputGenre.value
    }
    service.page = 1

    getFilm()
        .then(data => {
            renderPages(data.pages, service.page, paginationContainer)
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

function paginationHandler(e) {
    e.preventDefault()
    
    if (e.target.closest('.js-page-item')) {
        document.querySelectorAll('.js-page-item').forEach((pageItem) => {
            pageItem.classList.remove('active')
            e.target.closest('.js-page-item').classList.add('active')
            service.page = Number(e.target.closest('.js-page-item').textContent)
        })

        getFilm()
            .then(data => {
                renderPages(data.pages, service.page, paginationContainer)
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
    }

    if (e.target.closest('.page-item_next')) {
        service.page++
        getFilm()
            .then(data => {
                renderPages(data.pages, service.page, paginationContainer)
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
    }

    if (e.target.closest('.page-item_prev')) {
        service.page--
        getFilm()
            .then(data => {
                renderPages(data.pages, service.page, paginationContainer)
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
    }
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
    getFilm()
        .then(data => {
            renderPages(data.pages, service.page, paginationContainer)
            
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

    paginationContainer.addEventListener('click', paginationHandler)
})