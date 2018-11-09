let allCoins = [];

UIController = (function(){

    const DOMstrings = {
        activeCrypto: '.market-info__activeCrypto--data',
        marketCap: '.market-info__marketCap--data',
        marketVolume24h: '.market-info__volume24h--data',
        navPrimary: '.nav-primary',
        searchInput: '.findCoinName',
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
        coinDailyVolume: '.coinDailyVolume'
    };

    return{
        getDOMStrings: function(){
            return DOMstrings;
        }
    };

})();

const controller = (function(UIController){

    

    const getCurrencyLogo = () =>{
        $.ajax({
            url: 'https://chasing-coins.com/api/v1/std/logo/BTC'
        })
    }
    
    const numberRound = data => {
    
        let convert = Math.round(data).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return convert
    
    }
    
    const getCurrencyList = () => {
        let firstApi_dataArray = [];
        let secondApi_dataArray = [];
     
        $.ajax({
            url: 'https://chasing-coins.com/api/v1/top-coins/200',
            dataType: 'json',
            type: 'get',
     
        }).done(res => {
            firstApi_dataArray = Object.values(res)
            firstApi_dataArray.splice(100);
            getSecondData();
     
        });
     
        const getSecondData = () => {
            $.ajax({
                url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
                dataType: 'json',
                type: 'get',
                
                headers:{
                    'X-CMC_PRO_API_KEY': '90a88319-e5af-4f4b-9307-8c1bec2000b7',
                    'CMC_PRO_API_KEY': '90a88319-e5af-4f4b-9307-8c1bec2000b7'
                }
            }).done(res =>{
                secondApi_dataArray = Object.values(res.data);
                buildDOMCurrencyList(firstApi_dataArray, secondApi_dataArray);
    
                
            })
        }
    
        
        const buildDOMCurrencyList = (arrOne,arrTwo) =>{
    
            arrOne.forEach((item,index) => {
                let row = document.createElement('tr');
                row.className = 'row-coin';
                row.setAttribute("id", index);
                let secondApiArrayIndex = index;
    
               
                row.innerHTML = `
                    <th scope='row'>${index}</th>
                    <td class="logoNameCoin"><img width='25px' class="logoCoin" src='https://chasing-coins.com/api/v1/std/logo/${item.symbol}'/> <a href="${item.url}"><p class="nameCoin">${secondApi_dataArray[secondApiArrayIndex].name}</p></a><button class="addCoinFavourite"></button></td>
                    <td class="coinSymbol"><p>${item.symbol}</p></td>
                    <td class="coinMarketCap"><p>$ ${numberRound(item.cap)} </p></td>
                    <td class="coinPrice"><p>$ ${parseFloat(Math.round(item.price * 100) / 100).toFixed(2)}</p></td>
                    <td class="coinHourChange"><p>${item.change.hour > 0 ? '<span style="color: #43D64E;">' + "+" + item.change.hour + ' %' + '</span>' : '<span style="color: #ff0000;">' + item.change.hour + ' %'}</span></p></td>
                    <td class="coinDayChange"><p>${item.change.day > 0 ? '<span style="color: #43D64E;">' + "+" + item.change.day + ' %' + '</span>' : '<span style="color: #ff0000;">' + item.change.day + ' %'}</span</p></td>
                    <td class="coinWeekChange">
                    <p>
                        ${
                            secondApi_dataArray[secondApiArrayIndex].quote.USD.percent_change_7d > 0 ? '<span style="color: #43D64E;">' + '+' + parseFloat(Math.round(secondApi_dataArray[secondApiArrayIndex].quote.USD.percent_change_7d * 100) / 100).toFixed(2) + ' %' + '</span>' : '<span style="color: #ff0000;">' + parseFloat(Math.round(secondApi_dataArray[secondApiArrayIndex].quote.USD.percent_change_7d * 100) / 100).toFixed(2) + ' %' + '</span>'
                        }
                    </p>
                    </td>
                    <td class="coinDailyVolume">
                    <p>
                        ${numberRound(secondApi_dataArray[secondApiArrayIndex].quote.USD.volume_24h) + ' ' + secondApi_dataArray[secondApiArrayIndex].symbol}
                    </p>
                    </td>
                `
                    document.querySelector('.loading').style.display = 'none';
                    document.querySelector('.table-content').appendChild(row);
    
                
            });
            
        }
    }

    const searchCoin = () => {
        var td;
        var input = document.querySelector('.findCoinInput');
        
        var filter = input.value.toUpperCase();

        var table = document.getElementsByClassName('table-content');
        
        var tr = document.getElementsByClassName('row-coin');
        

        for(var i =0; i<tr.length; i++){
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


    const eventListenerHandler = () => {
        document.querySelector('.findCoinInput').addEventListener('keyup',searchCoin);
    }

    

    const getMarketInfo = () => {
        $.ajax({
            url: 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
                dataType: 'json',
                type: 'get',
                
            headers:{
                'X-CMC_PRO_API_KEY': '90a88319-e5af-4f4b-9307-8c1bec2000b7',
                'CMC_PRO_API_KEY': '90a88319-e5af-4f4b-9307-8c1bec2000b7'
            }
        }).done(res =>{
            var DOM = UIController.getDOMStrings();
            document.querySelector(DOM.activeCrypto).innerHTML = res.data.active_cryptocurrencies;
            document.querySelector(DOM.marketCap).innerHTML = '$' + numberRound(res.data.quote.USD.total_market_cap);
            document.querySelector(DOM.marketVolume24h).innerHTML = '$' + numberRound(res.data.quote.USD.total_volume_24h);
        })
    }

    return{
        init: function(){
            eventListenerHandler();
            getMarketInfo();
            getCurrencyLogo();
            getCurrencyList();
            console.log('Application has started');
        
        }
    }



})(UIController);



controller.init();

