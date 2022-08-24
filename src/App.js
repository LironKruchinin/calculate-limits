
/*
{
  CU:[1,2,3,4,5,6]

}
*/

const data = [];
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: 'Cu',
        datasets: [{
            label: 'Number of GitHub Stars',
            data: data,
        }, ],
    },
    options: {
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',  // Bar 1
            'rgba(54, 162, 235, 0.2)',  // Bar 2
            'rgba(255, 206, 86, 0.2)',  // Bar 3
            'rgba(75, 192, 192, 0.2)',  // Bar 4
            'rgba(153, 102, 255, 0.2)', // Bar 5
            'rgba(255, 159, 64, 0.2)'   // Bar 6
        ],
        borderWidth: 2,
        borderColor: 'black'
    }
});
