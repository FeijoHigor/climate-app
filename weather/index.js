const place = document.querySelectorAll('.place')[0]

const contentTag = document.getElementsByClassName('clear-not-found')
const notFoundMsg = document.getElementsByClassName('not-found')[0]

const outTemp = document.getElementsByClassName('real-temp')[0] 
const outFell = document.getElementsByClassName('feel-temp')[0]
const outMin = document.getElementsByClassName('min-temp')[0]
const outMax = document.getElementsByClassName('max-temp')[0]
const outHour = document.getElementsByClassName('hours')[0]
const outDate = document.getElementsByClassName('date')[0]

const imageBg = document.getElementsByClassName('image-background')[0]

const options = {
	"method": 'GET'
};

async function test() {
    const test1 = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${place.textContent}&APPID=167535198933c22e24f233fd901b70b5`, options)

    const test2 = await test1.text()

    const res = JSON.parse(test2)

    if(res['cod'] == '404') {
        console.log('Cidade não encontrada')
        contentTag[0].style.display = 'none'
        contentTag[1].style.display = 'none'
        notFoundMsg.style.display = 'flex'
        changeBackground(404, {})
    }else if (res['cod'] == '200') {
        console.log('Cidade encontrada', res.name)

        contentTag[0].style.display = 'block'
        contentTag[1].style.display = 'block'
        notFoundMsg.style.display = 'none'

        countHour(res.timezone)

        changeBackground(200, {timezone: res.timezone, weather: res.weather})

        const temp = res.main.temp - 273.15
        const feels_like = res.main.feels_like - 273.15
        const temp_min = res.main.temp_min - 273.15
        const temp_max = res.main.temp_max - 273.15


        place.textContent = res.name
        outTemp.innerText = correctNumber(temp.toFixed(1))
        outFell.innerText = correctNumber(feels_like.toFixed(1))
        outMin.innerText = correctNumber(temp_min.toFixed(1))
        outMax.innerText = correctNumber(temp_max.toFixed(1))
    } else {
        console.log('Houve algum erro :(')
    }

    return res

}

const changeBackground = (code, params) => {
    if(code == 404) {
        imageBg.style.background = "url('./images/not-found.jpg') no-repeat center"
        imageBg.style.backgroundSize = 'contain'
    }else if(code == 200) {
        const hourHere = new Date().getUTCHours() + (params.timezone / -60 / -60) + 24
        const hour = hourHere - 24 >= 24 ? hourHere - 48 : hourHere >= 24 ? hourHere - 24 : hourHere
        
        const hourOutput = hour >= 6 && hour <= 14 ? '1' : hour >= 15 && hour <= 18 ? '2' : hour >= 19 || hour <= 5 ? '3' : ''  //1=morning 2=affternoon 3=night
        
        const sky = params.weather[0].main
        var skyOutput = ''

        if(sky == 'Rain' || sky == 'Drizzle' || sky == 'Snow' || sky == 'Thunderstorm') {
            skyOutput = 'rain'
        }else if(sky == 'Clear') {
            skyOutput = 'clear'
        }else if(sky == 'Clouds' || params.weather[0].id > 700 && params.weather[0].id < 800) {
            skyOutput = 'clouds'
        }


        imageBg.style.background = `url('./images/${sky}-${hourOutput}.jpg') no-repeat center`

        console.log(hour, hourOutput)
        console.log(sky)
    }
}

const correctNumber = (number) => {
    if(number < 10) {
        number = '0' + number
    }
    return number
}

function updateHour(placeTime) {
    const date = new Date()

    var day = date.getUTCDate()
    const month = date.getUTCMonth() + 1
    const year = date.getUTCFullYear()

    const hourCount = date.getUTCHours() + (placeTime / -60 / -60) + 24
    const hour = hourCount - 24 >= 24 ? hourCount - 48 : hourCount >= 24 ? hourCount - 24 : hourCount
    const minute = date.getUTCMinutes()
    const second = date.getUTCSeconds()
    outHour.innerText = `${correctNumber(hour)}:${correctNumber(minute)}:${correctNumber(second)}`

    if(date.getUTCHours() + (placeTime / -60 / -60) < 0) {
        console.log('dia a menos')
        day--
    }else if(date.getUTCHours() + (placeTime / -60 / -60) > 24) {
        console.log('dia a mais')
        day++
    }else if(date.getUTCHours() + (placeTime / -60 / -60) > 0 && date.getUTCHours() + (placeTime / -60 / -60) < 24) {
        console.log('dia utc')
    }

    outDate.innerText = `${correctNumber(day)}/${correctNumber(month)}/${correctNumber(year)}`

}

function countHour(placeTime) {
    inter = setInterval(() => updateHour(placeTime), 1000)
}

function stopInterval() {
    clearInterval(inter)
}


document.addEventListener('keydown', async (e) => {
    if(e.key === "Enter") {
        place.blur()
        stopInterval()
        console.log(await test())
    }
})


document.addEventListener('DOMContentLoaded', async () => {
    console.log(await test())
})
