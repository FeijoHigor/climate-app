const place = document.querySelectorAll('.place')[0]

const outTemp = document.getElementsByClassName('real-temp')[0] 
const outFell = document.getElementsByClassName('feel-temp')[0]
const outMin = document.getElementsByClassName('min-temp')[0]
const outMax = document.getElementsByClassName('max-temp')[0]
const outHour = document.getElementsByClassName('hours')[0]
const outDate = document.getElementsByClassName('date')[0]

const optionsTwo = {
	"method": 'get',
	"headers": {
		'X-RapidAPI-Key': '167535198933c22e24f233fd901b70b5',
		'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com'
	}
};

const options = {
	"method": 'GET'
};

async function test() {
    const test1 = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${place.value}&APPID=167535198933c22e24f233fd901b70b5`, options)

    const test2 = await test1.text()

    const res = JSON.parse(test2)

    if(res['cod'] == '404') {
        console.log('Cidade não encontrada')
    }else if (res['cod'] == '200') {
        console.log('Cidade encontrada', res.name)

        countHour(res.timezone)

        const temp = res.main.temp - 273.15
        const feels_like = res.main.feels_like - 273.15
        const temp_min = res.main.temp_min - 273.15
        const temp_max = res.main.temp_max - 273.15


        place.value = res.name
        outTemp.innerText = correctNumber(temp.toFixed(1))
        outFell.innerText = correctNumber(feels_like.toFixed(1))
        outMin.innerText = correctNumber(temp_min.toFixed(1))
        outMax.innerText = correctNumber(temp_max.toFixed(1))
    } else {
        console.log('Houve algum erro :(')
    }

    return res

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
    const month = date.getUTCMonth()
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
        stopInterval()
        console.log(await test())
    }
})


document.addEventListener('DOMContentLoaded', async () => {
    console.log(await test())
})