const place = document.querySelectorAll('.place')[0]

const outTemp = document.getElementsByClassName('real-temp')[0] 
const outFell = document.getElementsByClassName('feel-temp')[0]
const outMin = document.getElementsByClassName('min-temp')[0]
const outMax = document.getElementsByClassName('max-temp')[0]
const outHour = document.getElementsByClassName('hours')[0]
const outDate = document.getElementsByClassName('date')[0]


document.addEventListener('keydown', async (e) => {
    if(e.key === "Enter") {
        console.log(await test())
    }
})

const options = {
	"method": 'get',
	"headers": {
		'X-RapidAPI-Key': 'c03f8b64f3msh3f156fdaf0c117dp177302jsn4e4d644ce2a5',
		'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com'
	}
};

async function test() {
    const test1 = await fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${place.value}&lat=0&lon=0&id=2172797&lang=null&units=metric&mode=json`, options)

    const test2 = await test1.text()

    var test3 = await test2

    const res = JSON.parse(test3)

    if(res['cod'] == '404') {
        console.log('Cidade não encontrada')
    }else if (res['cod'] == '200') {
        console.log('Cidade encontrada', res.name)

        const date = new Date()
        const hour = date.getUTCHours() + (res.timezone / -60 / -60)
        const minute = date.getUTCMinutes()
        const second = date.getUTCSeconds()
        console.log(hour >= 24 ? hour - 24 : hour, minute, second)
        outHour.innerText = `${hour >= 24 ? hour - 24 : hour}:${minute}:${second}`

        const day = hour >= 24 ? date.getUTCDate() + 1 : date.getUTCDate()
        const month = date.getUTCMonth() + 1
        const year = date.getUTCFullYear()

        //console.log(day < 10 ? "0"+day : day, month < 10 ? "0"+month : month, year)
        outDate.innerText = `${day < 10 ? "0"+day : day}/${month < 10 ? "0"+month : month}/${year}`

        place.value = res.name
        outTemp.innerText = res.main.temp.toFixed(1)
        outFell.innerText = res.main.feels_like.toFixed(1)
        outMin.innerText = res.main.temp_min.toFixed(1)
        outMax.innerText = res.main.temp_max.toFixed(1)
    } else {
        console.log('Houve algum erro :(')
    }

    return res

}

document.addEventListener('DOMContentLoaded', async () => {
    console.log(await test())
})
