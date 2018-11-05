var getCurrencyLogo = function(){
    $.ajax({
        url: 'https://chasing-coins.com/api/v1/std/logo/BTC'
    })
}

var numberRound = function(data){

    var convert = Math.round(data).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return convert
}



var getCurrencyList = function(){
        $.ajax({
        url: 'https://chasing-coins.com/api/v1/top-coins/200',
        dataType: 'json',
        type: 'get',

    }).done(function(res){
        
        
        // console.log(change7D);
        // var additionalArray = [];
        var dataArray = [];
        
        // console.log(additionalArray);
        dataArray = Array.from(Object.keys(res), k=>res[k]);
        dataArray.forEach((item,index) =>{

            var row = document.createElement('tr');

            
            row.className = 'row-coin';
            
            row.innerHTML = `
                <th scope='row'>${index}</th>
                <td class='logoNameCoin'><img width='25px ' src='https://chasing-coins.com/api/v1/std/logo/${item.symbol}'/> <p>${item.symbol}</p></td>
                <td><p>$ ${numberRound(item.cap)} </p></td>
                <td><p>$ ${parseFloat(Math.round(item.price * 100) / 100).toFixed(2)}</p></td>
                <td><p>${item.change.hour > 0 ? '<span style="color: green;">' + "+" + item.change.hour + '</span>' : '<span style="color: red;">' + item.change.hour}</span></p></td>
                <td><p>${item.change.day > 0 ? '<span style="color: green;">' + "+" + item.change.day + '</span>' : '<span style="color: red;">' + item.change.day}</span> </p></td>
                
                
            `

             setTimeout(function(){
                document.querySelector('.loading').style.display = 'none';
                document.querySelector('.table-content').appendChild(row);
             }, 4000)

        });

    });

    
}

getCryptocurrencyGlobalInfo();
getCurrencyList();





















var UIController = (function(){


    var DOMstrings = {
        cryptoAmount: '.market-info__cryptoAmount',
        marketsAmount: '.market-info__marketsAmount',
        marketCap: '.market-info__marketCap',
        dailyVolume: '.market-info__dailyVolume',
        navPrimary: '.nav-primary',
        navSecondary: '.nav-secondary',
        navHamburgerBtn: '.nav-hamburger',
    };

    return{
        navHambBtnClick: function() {
            console.log('chuj');
        },

        getDOMStrings: function(){
            return DOMstrings;
        }
    };

})();

var controller = (function(UIController){
    
    var setupEventListeners = function(){
        var DOM = UIController.getDOMStrings();
        
        document.querySelector(DOM.navHamburgerBtn).addEventListener('click', function(){
            $(DOM.navSecondary).toggle();
        });
    }

    return{
        init: function(){
            setupEventListeners();
            console.log('Application has started');
        
        }
    }



})(UIController);

controller.init();


