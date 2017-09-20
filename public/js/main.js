function App() {
  this.ctx = document.getElementById("myChart").getContext('2d');
}

App.prototype.init = function () {
  this.drawChart();
};

App.prototype.fetchData = function (url) {
  return new Promise((resolve, reject) => {
    return fetch(url)
      .then(blob => blob.json())
      .then(response => {
        return resolve(response);
      })
      .catch(err => reject(err));
  })
};

App.prototype.drawChart = function () {
  this.fetchData('/api/usage')
    .then(res => {
      var labels = res.map(item =>
        new Date(item.created_at).toString().split(' ').slice(0, 4).join(' ')
      ).reverse();
      var hits = res.map(item => item.hits).reverse();

      var myChart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            lineTension: 0.5,
            borderColor: '#3498db',
            label: '# of hits',
            data: hits,
            borderWidth: 2,
            backgroundColor: 'transparent'
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }]
          }
        }
      });

    });
};

var app = window.app = new App();
app.init()
