let availableKeywords = [
'Men Belt',
'Men sandle',
'Men formalpants',
'Men shortpants',
'Men fulltshirts',
'Men halftshirts',
'Men Jeans',
'Men Wallet',
'Men formalshirts',
'Men sportsshoes',
'Men casualshoes',
'Men casual shirts',
'Men watch',
'Men sunglasses',
'Men formalshoes',
'Men casualshoes',
'Men trackpant',
'Women bellies',
'Women saree',
'Women jwellery',
'Women flats',
'Women earrings',
'Women bengle',
'Women jutis',
'Women kurtis',
'Kids girlsfootwear',
'Kids nightwear',
'Kids boysfootwear',
'Kids game',
'Kids hardtoys',
'Kids bottomwear',
'Kids softtoys',
'Kids topwear',
'Mobile adapter',
'Mobile powerbank',
'Mobile storagedevice',
'Mobile speaker',
'Mobile typec',
'Mobile wired earphones',
'Mobile wireless earphones',
'Mobile usb',
'Mobile lightning',
'Computer ethernet',
'Computer HDD',
'Computer monitor',
'Computer wireless mouse',
'Computer pendrive',
'Computer SSD',
'Computer wired mouse',
'Computer wireless keyboard',
'Computer hdmi',
'Computer vgi',
'Computer wired keyboard',
'Bag laptopbag',
'Bag travelling bag',
'Bag mensbag',
'Bag womenbag'
];

const resultBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;
    if(input.length){
        result = availableKeywords.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
        // console.log(result);
    }
    display(result);

    if(!result.length){
        resultBox.innerHTML = '';
    }
}

function display(result){
    const content = result.map((list)=>{
        return "<li onClick = selectInput(this)>" + list + "</li>";
    })
    resultBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function selectInput(list){
    inputBox.value = list.innerHTML;
    resultBox.innerHTML = '';
}
