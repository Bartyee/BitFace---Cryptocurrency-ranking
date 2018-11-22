UIController = (function(){

    let DOMstrings = {
        activeCrypto: '.market-info__activeCrypto--data',
        marketCap: '.market-info__marketCap--data',
        marketVolume24h: '.market-info__volume24h--data',
        navPrimary: '.nav-primary',
        searchInput: '.findCoinInput',
        navSecondary: '.nav-secondary',
        navHamburgerBtn: '.nav-hamburger',
        rowCoin: '.row-coin',
        logoNameCoin: '.logoNameCoin',
        coinFavouriteBtn: '.addCoinFavourite',
        coinSymbol: '.coinSymbol',
        coinMarketCap: '.coinMarketCap',
        coinPrice: '.coinPrice',
        coinHourChange: '.coinHourChange',
        coinDayChange: '.coinDayChange',
        coinWeekChange: '.coinWeekChange',
        coinDailyVolume: '.coinDailyVolume',
        renderCurrencyList: false,
    };

    return{
        getDOMStrings: function(){
            return DOMstrings;
        }
    };

})();

const controller = (function(UIController){

    const getMarketInfo = () => {
        let proxy = 'https://cors-anywhere.herokuapp.com/';
        $.ajax({
            url: proxy + 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
                dataType: 'json',
                type: 'get',
                
            headers:{
                'X-CMC_PRO_API_KEY': '90a88319-e5af-4f4b-9307-8c1bec2000b7',
                'CMC_PRO_API_KEY': '90a88319-e5af-4f4b-9307-8c1bec2000b7'
            }
        }).done(res =>{
            let DOM = UIController.getDOMStrings();
            document.querySelector(DOM.activeCrypto).innerHTML = res.data.active_cryptocurrencies;
            document.querySelector(DOM.marketCap).innerHTML = '$' + numberRound(res.data.quote.USD.total_market_cap);
            document.querySelector(DOM.marketVolume24h).innerHTML = '$' + numberRound(res.data.quote.USD.total_volume_24h);
        })
    }
    
    
    
    const numberRound = data => {
        let convert = Math.round(data).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return convert
    }
    
    const getCurrencyList = () => {
        let proxy = 'https://cors-anywhere.herokuapp.com/';
        let firstApi_dataArray = [];
        let secondApi_dataArray = [];
     
        $.ajax({
            url: proxy + 'https://chasing-coins.com/api/v1/top-coins/200',
            dataType: 'json',
            type: 'get',
     
        }).done(res => {
            firstApi_dataArray = Object.values(res)
            firstApi_dataArray.splice(100);
            getSecondData();
        });
     
        const getSecondData = () => {
            let proxy = 'https://cors-anywhere.herokuapp.com/';
            $.ajax({
                url: proxy + 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
                dataType: 'json',
                type: 'get',
                
                headers:{
                    'Access-Control-Allow-Origin': proxy + 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
                    'X-CMC_PRO_API_KEY': '90a88319-e5af-4f4b-9307-8c1bec2000b7',
                    'CMC_PRO_API_KEY': '90a88319-e5af-4f4b-9307-8c1bec2000b7'
                }
            }).done(res =>{
                secondApi_dataArray = Object.values(res.data);
                buildDOMCurrencyList(firstApi_dataArray, secondApi_dataArray);
            })
        }
    
        
        const buildDOMCurrencyList = (arrOne,arrTwo) =>{ //Two API arrays

            let favouriteArray = []; // Array with favourite Coins

            let bitcoinPrice;
            let ethereumPrice;

            

            let renderDom = false;

                arrOne.forEach((item,index) => { //get arrOne items and from arrTwo
                    btcPrice = arrOne[0].price; //Bitcoin is always on 1st place
                    ethPrice = arrOne[2].price; //Ethereum place, now its 3 :P 
                    let row = document.createElement('tr');
                    row.className = 'row-coin';
                    row.setAttribute("id", index);
                    let secondApiArrayIndex = index;

                    const checkIfElementIsInLocalStorage = (index) => {
                        if(localStorage.getItem(index) != null){
                            row.className += " checked";
                            $(row.children[1].children[2]).addClass("addCoinFavourite-checked");
                        }
                        else{
                            return "";
                        }
                    }

                    
                    
                    row.innerHTML = `
                        <th scope='row'>${index+1}</th>
                <td class="logoNameAndCoin"><img width='25px' class="logoCoin" src='https://chasing-coins.com/api/v1/std/logo/${item.symbol}'/> <a href="${item.url}"><p class="nameCoin">${arrTwo[secondApiArrayIndex].name}</p></a><button class="addCoinFavourite"></button></td>
                        <td class="coinSymbol"><p>${item.symbol}</p></td>
                        <td class="coinMarketCap"><p>$ ${numberRound(item.cap)} </p></td>
                        <td class="coinPrice"><p>$ ${item.price.charAt(0) == '0' ? parseFloat(item.price * 100 / 100).toFixed(4).replace(",", ".") : parseFloat(item.price * 100 / 100).toFixed(2).replace(",", ".")} </p></td>
                        <td class="coinHourChange"><p>${item.change.hour > 0 ? '<span class="changeProfitColor" style="color: #43D64E;">' + "+" + item.change.hour + ' %' + '</span>' : '<span class="changeLossColor" style="color: #ff0000;">' + item.change.hour + ' %'}</span></p></td>
                        <td class="coinDayChange"><p>${item.change.day > 0 ? '<span class="changeProfitColor" style="color: #43D64E;">' + "+" + item.change.day + ' %' + '</span>' : '<span class="changeLossColor" style="color: #ff0000;">' + item.change.day + ' %'}</span</p></td>
                        <td class="coinWeekChange">
                        <p>
                            ${
                                arrTwo[secondApiArrayIndex].quote.USD.percent_change_7d > 0 ? '<span class="changeProfitColor" style="color: #43D64E;">' + '+' + parseFloat(Math.round(arrTwo[secondApiArrayIndex].quote.USD.percent_change_7d * 100) / 100).toFixed(2) + ' %' + '</span>' : '<span class="changeLossColor" style="color: #ff0000;">' + parseFloat(Math.round(arrTwo[secondApiArrayIndex].quote.USD.percent_change_7d * 100) / 100).toFixed(2) + ' %' + '</span>'
                            }
                        </p>
                        </td>
                        <td class="coinDailyVolume">
                        <p>
                            ${numberRound(arrTwo[secondApiArrayIndex].quote.USD.volume_24h) + ' ' + arrTwo[secondApiArrayIndex].symbol}
                        </p>
                        </td>
                    `
                        document.querySelector('.loading').style.display = 'none';
                        document.querySelector('.table-data').appendChild(row);

                        checkIfElementIsInLocalStorage(index);

                        if(index == arrOne.length - 1){
                            renderDom = true;                
                        }
                });
             
            if(renderDom == true){
                addCoinToFavourite();
                let buttonArray = [...document.getElementsByClassName('addCoinFavourite')];

                buttonArray.forEach((item) => {
                    item.addEventListener('click',function(){
                        
                        let index = favouriteArray.indexOf(item.parentElement.parentElement)
                        
                        
                        if(favouriteArray.includes(item.parentElement.parentElement)){
                            $(item).toggleClass('addCoinFavourite-checked');
                            if(index > -1){
                                favouriteArray.splice(index, 1);
                                console.log(favouriteArray);
                            }
                            

                        }
                        else{
                            console.log('Id dodanego rowa ' + item.parentElement.parentElement.id);
                            favouriteArray.push(item.parentElement.parentElement);
                            $(item).toggleClass('addCoinFavourite-checked');
                            console.log(favouriteArray);
                        }

                    })
                })

                favouriteListClick();
                convertPrice();
            }

            
        }
    }

    const searchCoin = () => {
        let td;
        let input = document.querySelector('.findCoinInput');
        
        let filter = input.value.toUpperCase();
        
        let tr = document.getElementsByClassName('row-coin');
        

        for(let i =0; i<tr.length; i++){
            td = tr[i].getElementsByTagName('p')[0].childNodes[0].nodeValue;
            if(td) {
                if(td.toUpperCase().indexOf(filter) > -1){
                    tr[i].style.display = "";
                } else{
                    tr[i].style.display = "none";
                }
            }
        }
    }

    const findCoinInput = () => {
        let DOM = UIController.getDOMStrings();
        document.querySelector(DOM.searchInput).addEventListener('keyup',searchCoin);
    }

    const addCoinToFavourite = () => {
        var btn = document.querySelectorAll(".addCoinFavourite");

        for(let i=0; i<btn.length; i++){
            btn[i].addEventListener("click",function(){
                $(btn[i].parentElement.parentElement).toggleClass("checked");
                $(btn[i]).addClass("checked");
                if(localStorage.getItem(btn[i].parentElement.parentElement.id) == null){
                    localStorage.setItem(btn[i].parentElement.parentElement.id,'checked');
                    
                }
                else if(localStorage.getItem(btn[i].parentElement.parentElement.id) != null){
                    localStorage.removeItem(btn[i].parentElement.parentElement.id);
                }
                
                
            })
        } 
    }

    const favouriteListClick = () => {
        let favouriteTab = document.querySelector('.nav__tools--favourites');
        let rowCoin = document.querySelectorAll('.row-coin');
        let tableContent = document.querySelector('.table-data').children;

        favouriteTab.addEventListener("click",function(){
            $(tableContent).toggle();
            for(let i=0; i<=rowCoin.length; i++){
                if($(rowCoin[i]).hasClass("checked")){
                    $(rowCoin[i]).show();
                }
            }
        })
    }

    const convertPrice = () => {
        let selectInput = document.querySelector(".custom-select");
        $(selectInput).show();
        let prices = document.getElementsByClassName("coinPrice");
        let coinMarketCap = document.getElementsByClassName("coinMarketCap");
        let volumePrice = document.getElementsByClassName("coinDailyVolume");

        let usdPrice = [];
        let coinMarketCapUsdPrice = [];
        let volumeUsdPrice = []; //USD Price array for actually prices on site. Need for toggle USD To BTC and back. 
        let btcPrice; //bitcoin Price from localStorage, if not exist or other than this variable ajax api call function and save this in localstorage.

        const saveActuallyUsdPrice = () => {
            for(let i=0; i<prices.length; i++){
                usdPrice[i] = prices[i].textContent;
                coinMarketCapUsdPrice[i] = coinMarketCap[i].textContent;
                volumeUsdPrice[i] = volumePrice[i].textContent;
            }
        }

        saveActuallyUsdPrice();

        

        let proxy = 'https://cors-anywhere.herokuapp.com/';

        if(localStorage.getItem("btcPrice") == null || localStorage.getItem("btcPrice") != btcPrice)
        {
            $.ajax({
                url: proxy + 'https://chasing-coins.com/api/v1/convert/USD/BTC',
                dataType: 'json',
                type: 'get',
            }).done(res => {
                btcPrice = res.result;
                localStorage.setItem("btcPrice",btcPrice);
            })
        }

        selectInput.addEventListener('change',function(){
                if(this.value == "1"){
                    for(let i=0; i<prices.length; i++){
                        prices[i].style.color = "";
                        prices[i].textContent = usdPrice[i];
                        coinMarketCap[i].style.color = "";
                        coinMarketCap[i].textContent = coinMarketCapUsdPrice[i];
                    }
                }
                else if(this.value == "2"){
                    for(let i=0; i<prices.length; i++){
                        prices[i].style.color = "#E38215";
                        if(i==0){
                            prices[i].textContent = "$ 1.00";
                        }
                        else{
                            prices[i].textContent = prices[i].textContent.replace(/\$/g,'');
                            let text = prices[i].textContent;
                            let convert = parseFloat(text);
                            prices[i].textContent = '$ ' + (convert * btcPrice).toFixed(8).toString();
                            
                        }
                    }
                    for(let i=0; i<coinMarketCap.length; i++){
                        coinMarketCap[i].style.color = "#E38215";
                        
                        if(i==0){
                            coinMarketCap[i].textContent = coinMarketCap[i].textContent.replace(/\$/g,'').replace(/\s/g,'');
                            let text = coinMarketCap[i].textContent;
                            let convert = parseFloat(text);
                            coinMarketCap[i].textContent = '$ ' + parseInt((convert*btcPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                            
                        }
                        else{
                            
                            coinMarketCap[i].textContent = coinMarketCap[i].textContent.replace(/\$/g,'').replace(/\s/g,'');
                            let text = coinMarketCap[i].textContent;
                            let convert = parseFloat(text);
                            coinMarketCap[i].textContent = '$ ' + parseInt((convert*btcPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                        }
                    }
                }
        })
    }
    

    

    return{
        init: function(){
            findCoinInput();
            getMarketInfo();
            getCurrencyList();
            console.log('Application has started');
        }
    }



})(UIController);



controller.init();

