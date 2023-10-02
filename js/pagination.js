function renderPrevArrow(isDisabled = true) {
    return `
        <li class="page-item page-item_prev ${isDisabled ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `
}

function renderNextArrow(isDisabled = false) {
    return `
        <li class="page-item page-item_next ${isDisabled ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `
}

function renderLastPage(pagesCount) {
    return `
        <span class="gap-item">...</span>
        <li class="page-item js-page-item"><a class="page-link" href="#">${pagesCount}</a></li>
    `
}

function renderButtons(index, stopValue, current) {
    let buttonsHtml = ''
    for (let i = index; i <= stopValue; i++) {
        buttonsHtml += `<li class="page-item js-page-item ${current === i ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`
    }
    return buttonsHtml
}

function renderGap() {
    return `<span class="gap-item">...</span>`
}

function renderFirstPage() {
    return `<li class="page-item js-page-item"><a class="page-link" href="#">1</a></li>`
}

function renderPages(pages, current, paginationContainer) {
    paginationContainer.innerHTML = '';
    const count = 3

    if (pages === 1) {
        return
    }

    if (pages <= (count + 1) * 2) {
        paginationContainer.insertAdjacentHTML('beforeend', renderButtons(1, pages, current))
        
    } else {

        if (current <= count) {
            paginationContainer.insertAdjacentHTML('beforeend', renderButtons(1, count, current))
            paginationContainer.insertAdjacentHTML('afterbegin', renderPrevArrow())
            paginationContainer.insertAdjacentHTML('beforeend', renderLastPage(pages))
            paginationContainer.insertAdjacentHTML('beforeend', renderNextArrow())
        }
    
        if (current > count && current <= pages - count) {
            paginationContainer.insertAdjacentHTML('beforeend', renderFirstPage())
            paginationContainer.insertAdjacentHTML('beforeend', renderGap())
            paginationContainer.insertAdjacentHTML('beforeend', renderButtons(current - Math.floor(count / 2), current + Math.floor(count / 2), current))
            paginationContainer.insertAdjacentHTML('afterbegin', renderPrevArrow(false))
            paginationContainer.insertAdjacentHTML('beforeend', renderLastPage(pages))
            paginationContainer.insertAdjacentHTML('beforeend', renderNextArrow())
        }
    
        if (current > pages - count) {
            paginationContainer.insertAdjacentHTML('beforeend', renderFirstPage())
            paginationContainer.insertAdjacentHTML('afterbegin', renderPrevArrow(false))
            paginationContainer.insertAdjacentHTML('beforeend', renderGap())
            paginationContainer.insertAdjacentHTML('beforeend', renderButtons(pages - count + 1, pages, current))
            paginationContainer.insertAdjacentHTML('beforeend', renderNextArrow(true))
        }
    }
}

export default renderPages