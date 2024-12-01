const searchWrapper = document.querySelector(".input-wrapper");
const inputBox = document.querySelector(".input");
const menu = document.querySelector(".menu");
const list = document.querySelector('.list');

let data = null;

function handleClick(e) {
    const id = e.target.dataset.id;
    inputBox.value = ''
    menu.innerHTML = ''
    const name = data[id].name
    const author = data[id].author
    const stars = data[id].stars
    if(document.getElementById(id)) {
        return
    }
    list.insertAdjacentHTML('afterbegin', 
        `<li class="list__elem repository" id="${id}">
            <div class="repository__left">
                <span class="repository__text">Name: ${name}</span>
                <span class="repository__text">Owner: ${author}</span>
                <span class="repository__text">Stars: ${stars}</span>
            </div>
            <div class="repository__right">
                <button class="repository__delete" data-id="${id}"><svg data-id="${id}" fill="red" width="40px" height="40px" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><path data-id="${id}" d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"/></svg></button>
            </div>
        </li>`)
    const eventListener = document.querySelector('.repository').addEventListener('click', function(e) {
            if(e.target.dataset.id) {
                const deleteRep = document.getElementById(e.target.dataset.id)
                deleteRep.remove()
            }
        })
}

function getRepositories(name) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.github.com/search/repositories?q=${name}`)
            .then(response => response.json())
            .then(rep => resolve(rep))
            .catch(err => reject(err))
    })
}

function onChange(e) {
    const repositories = {};
    const value = e.target.value;
    if (value.trim().length === 0) {
        menu.innerHTML = ''
        return
    }
    getRepositories(value).then((rep) => rep.items)
        .then((reps) => {
            let i = -1
            for (let rep of reps) {
                i++
                if(i === 5) {
                    break
                }
                repositories[rep.id] = {"name": rep.name, "author": rep.owner.login, "stars": rep.stargazers_count}
            }
            return repositories
        })
        .then((repositories) => {
            menu.innerHTML = ''
            for (let i in repositories) {
                const li = document.createElement('li')
                li.classList.add('menu__elem')
                li.innerText = repositories[i].name
                li.setAttribute('data-id', i)
                li.addEventListener('click', handleClick)
                menu.appendChild(li)
            }
            data = repositories
        })
}

const debounce = (fn, ms) => {
    let timeout
    return function () {
        const fnCall = () => {fn.apply(this, arguments)}
        clearTimeout(timeout)
        timeout = setTimeout(fnCall, ms)
    }
}

inputBox.addEventListener('keyup', debounce(onChange, 400))