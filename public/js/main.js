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
      var labels = res.map(item => item.dimensions);
      var hits = res.map(item => item.hits);


      var myChart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '# of hits',
            data: hits,
            borderWidth: 1
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
