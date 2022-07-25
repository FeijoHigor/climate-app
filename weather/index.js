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
		'X-RapidAPI-Key': 'c03f8b64f3msh3f156fdaf0c117dp177302jsn4e4d644ce2a5',
		'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com'
	}
};

const options = {
	"method": 'GET',
	"headers": {
		'X-RapidAPI-Key': 'd3375f5e49mshdbee8e8f75dff43p1bd2e5jsnc82b02f566ec',
		'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com'
	}
};

async function test() {
    const test1 = await fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${place.value}&lat=0&lon=0&id=2172797&lang=null&units=metric&mode=json`, options)

    const test2 = await test1.text()

    const res = JSON.parse(test2)

    if(res['cod'] == '404') {
        console.log('Cidade não encontrada')
    }else if (res['cod'] == '200') {
        console.log('Cidade encontrada', res.name)

        countHour(res.timezone)

        place.value = res.name
        outTemp.innerText = correctNumber(res.main.temp.toFixed(1))
        outFell.innerText = correctNumber(res.main.feels_like.toFixed(1))
        outMin.innerText = correctNumber(res.main.temp_min.toFixed(1))
        outMax.innerText = correctNumber(res.main.temp_max.toFixed(1))
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