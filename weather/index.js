const place = document.querySelectorAll('.place')[0]

const outTemp = document.getElementsByClassName('real-temp')[0] 
const outFell = document.getElementsByClassName('feel-temp')[0]
const outMin = document.getElementsByClassName('min-temp')[0]
const outMax = document.getElementsByClassName('max-temp')[0]


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
        place.value = res.name
    } else {
        console.log('Houve algum erro :(')
    }

    return res
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log(await test())
})
