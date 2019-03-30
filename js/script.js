function getTotal() {
  var today = moment().format();
  fetch('https://api.sandbox.paypal.com/v1/reporting/transactions/?start_date=2019-03-01T00:00:00-0700&end_date=' + today + '&fields=all&page_size=100&page=1',
  {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer A21AAFgBvixuhIEy4w4RcibkmeEUFyTrSdduUb8akqvrdSW6jQz1oOvoWgmY57ObNXoeGb4MyTBklNec2evSopgirQKmUESeQ'
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(transaction) {
      calculatePercentage(transaction.transaction_details);
    });
}

function calculatePercentage(transactions){
  var goal = 45000;
  var totalAmount = 0;
  var money = document.getElementsByClassName('money');
  for(i=0 ; i<transactions.length ; i++) {
    totalAmount = totalAmount + parseFloat(transactions[i].transaction_info.transaction_amount.value)*100;
  }
  var progress = ((totalAmount*2)*100)/60000;
  var percentage = 60000-(totalAmount*2);
  document.getElementById('progress').style.width = parseInt(progress).toString()+'%';
  document.getElementById('percentage').innerHTML = percentage.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');;
  for (m = 0; m < money.length; m++) {
    money[m].innerHTML = totalAmount.toString();
  }
  if (progress <= 33) {
    document.getElementById('progress').style.backgroundColor = '#b71c1c';
  } else if (progress >= 34 && progress <= 66) {
    document.getElementById('progress').style.backgroundColor = '#ff6f00';
  }
}

(function ($) {
  getTotal();
  [
    {
      container: ".button-a",
      style: {
        label:  "pay",
        shape:  "pill",
        fundingicons: false,
        layout: "horizontal",
        tagline: false,
        width: 114,
        height: 32
      }
    },
    {
      container: ".button-b",
      style: {
        label:  "pay",
        shape:  "pill",
        fundingicons: false,
        layout: "horizontal",
        tagline: false,
        width: 172,
        height: 46
      }
    },
    {
      container: ".button-c",
      style: {
        label:  "pay",
        shape:  "pill",
        fundingicons: false,
        layout: "horizontal",
        tagline: false,
        width: 172,
        height: 46
      }
    }
  ].forEach(function(button) {
    paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '10'
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        return fetch('/paypal-transaction-complete', {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            orderID: data.orderID
          })
        });

        getTotal();
      });
    },
    // commit: true,
    style: button.style
  }).render(button.container);
  // }).render(element);
  });
})(jQuery);