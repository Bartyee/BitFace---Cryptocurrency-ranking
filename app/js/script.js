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
        renderDone: false,
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

            let renderDom = false;

            let favouriteCoinList = [];
    
            arrOne.forEach((item,index) => { //get arrOne items and from arrTwo
                let row = document.createElement('tr');
                row.className = 'row-coin';
                row.setAttribute("id", index);
                let secondApiArrayIndex = index;
                
                row.innerHTML = `
                    <th scope='row'>${index}</th>
                    <td class="logoNameCoin"><img width='25px' class="logoCoin" src='https://chasing-coins.com/api/v1/std/logo/${item.symbol}'/> <a href="${item.url}"><p class="nameCoin">${arrTwo[secondApiArrayIndex].name}</p></a><button class="addCoinFavourite"></button></td>
                    <td class="coinSymbol"><p>${item.symbol}</p></td>
                    <td class="coinMarketCap"><p>$ ${numberRound(item.cap)} </p></td>
                    <td class="coinPrice"><p>$ ${parseFloat(Math.round(item.price * 100) / 100).toFixed(2)}</p></td>
                    <td class="coinHourChange"><p>${item.change.hour > 0 ? '<span style="color: #43D64E;">' + "+" + item.change.hour + ' %' + '</span>' : '<span style="color: #ff0000;">' + item.change.hour + ' %'}</span></p></td>
                    <td class="coinDayChange"><p>${item.change.day > 0 ? '<span style="color: #43D64E;">' + "+" + item.change.day + ' %' + '</span>' : '<span style="color: #ff0000;">' + item.change.day + ' %'}</span</p></td>
                    <td class="coinWeekChange">
                    <p>
                        ${
                            arrTwo[secondApiArrayIndex].quote.USD.percent_change_7d > 0 ? '<span style="color: #43D64E;">' + '+' + parseFloat(Math.round(arrTwo[secondApiArrayIndex].quote.USD.percent_change_7d * 100) / 100).toFixed(2) + ' %' + '</span>' : '<span style="color: #ff0000;">' + parseFloat(Math.round(arrTwo[secondApiArrayIndex].quote.USD.percent_change_7d * 100) / 100).toFixed(2) + ' %' + '</span>'
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
                    document.querySelector('.table-content').appendChild(row);


                    if(index == arrOne.length - 1){
                        renderDom = true;
                    }

                    
                    // if (index == arrOne.length - 1){ //sprawdzam czy zakończono render wszystkich elementów z API
                        
                    //     let items = document.getElementsByClassName('addCoinFavourite'); // porbranie list elementów gdzie znajdują się buttony


                    //     for(let i = 0; i<items.length; i++){ 
                    //         items[i].addEventListener('click', function(){ //przypisanie do każdego elementu funkcji click
                    //             let index = this.parentNode.parentNode.id;
                    //             if(favouriteCoinList.includes(items[i].parentNode.parentNode))
                    //             {
                    //                 $(this).toggleClass("addCoinFavourite-green")
                    //                 favouriteCoinList.splice(index,1)
                    //                 console.log(favouriteCoinList)
                    //             }
                    //             else{
                    //                 $(this).toggleClass("addCoinFavourite-green")
                    //                 console.log(favouriteCoinList.push(this.parentNode.parentNode));
                    //                 console.log(favouriteCoinList);
                    //             }
                    //             console.log(index);
                    //         });
                    //     }
                    // }
            });

            if(renderDom == true){
                var items = document.getElementsByClassName('addCoinFavourite');
                console.log(items);

                for(let i = 0; i<items.length; i++){
                    items[i].addEventListener('click', function(){
                        console.log('click');
                        let index = this.parentNode.parentNode.id;
                        if(favouriteCoinList.includes(items[i].parentNode.parentNode)){
                            $(items[i]).toggleClass("addCoinFavourite-green");
                            favouriteCoinList.splice(index,1)
                            console.log(favouriteCoinList)
                        }
                        else{
                            $(items[i]).toggleClass("addCoinFavourite-green")
                            console.log(favouriteCoinList.push(this.parentNode.parentNode));
                            console.log(favouriteCoinList);
                        }
                    })
                }
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

    const remove = (array,element) => {
        return array.filter(e => e !== element)
    }

    

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

    return{
        init: function(){
            findCoinInput();
            getMarketInfo();
            getCurrencyLogo();
            getCurrencyList();
            console.log('Application has started');
        
        }
    }



})(UIController);



controller.init();

