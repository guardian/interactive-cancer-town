import * as d3 from 'd3';

let svg, ctx;

let data = [
  {
    "Month": "2016 05",
    "Value": 6.08025
  },
  {
    "Month": "2016 06",
    "Value": 3.081856667
  },
  {
    "Month": "2016 07",
    "Value": 5.895
  },
  {
    "Month": "2016 08",
    "Value": 8.417380952
  },
  {
    "Month": "2016 09",
    "Value": 7.41369
  },
  {
    "Month": "2016 10",
    "Value": 13.58961515
  },
  {
    "Month": "2016 11",
    "Value": 18.84567667
  },
  {
    "Month": "2016 12",
    "Value": 7.925791667
  },
  {
    "Month": "2017 01",
    "Value": 6.840813333
  },
  {
    "Month": "2017 02",
    "Value": 3.002081667
  },
  {
    "Month": "2017 03",
    "Value": 1.941251667
  },
  {
    "Month": "2017 04",
    "Value": 4.771485
  },
  {
    "Month": "2017 05",
    "Value": 2.00434
  },
  {
    "Month": "2017 06",
    "Value": 7.500883333
  },
  {
    "Month": "2017 07",
    "Value": 3.629787879
  },
  {
    "Month": "2017 08",
    "Value": 4.636281667
  },
  {
    "Month": "2017 09",
    "Value": 4.647356667
  },
  {
    "Month": "2017 10",
    "Value": 5.602461667
  },
  {
    "Month": "2017 11",
    "Value": 11.17703333
  },
  {
    "Month": "2017 12",
    "Value": 1.590898485
  },
  {
    "Month": "2018 01",
    "Value": 6.817143333
  },
  {
    "Month": "2018 02",
    "Value": 3.396866852
  },
  {
    "Month": "2018 03",
    "Value": 1.382102667
  },
  {
    "Month": "2018 04",
    "Value": 1.937685833
  },
  {
    "Month": "2018 05",
    "Value": 0.8845631818
  },
  {
    "Month": "2018 06",
    "Value": 1.214785333
  },
  {
    "Month": "2018 07",
    "Value": 0.5131761667
  },
  {
    "Month": "2018 08",
    "Value": 1.050683333
  },
  {
    "Month": "2018 09",
    "Value": 1.971898
  },
  {
    "Month": "2018 10",
    "Value": 6.053004015
  },
  {
    "Month": "2018 11",
    "Value": 1.798457593
  },
  {
    "Month": "2018 12",
    "Value": 6.409159259
  },
  {
    "Month": "2019 01",
    "Value": 1.948315833
  },
  {
    "Month": "2019 02",
    "Value": 3.1446725
  },
  {
    "Month": "2019 03",
    "Value": 1.64635
  }
];

export default {
    init: function() {
        $(document).ready(function() {
            this.createChart();
        }.bind(this));
    },

    createChart: function() {
        $('.content__main-column--interactive p:eq(1)').after('<div class=\'uit-visual__chart\'></div>');

        const width = $('.uit-visual__chart').width();
        // const height = $('.uit-visual__chart').height();
        const height = 400;
        svg = d3.select('.uit-visual__chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height + 20);

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const valueLine = d3.line()
            .x(function(d) { return x(d.Month) })
            .y(function(d) { return y(d.Value) });

        const parseTime = d3.timeParse("%Y %m");

        data.forEach(function(d) {
            d.Month = parseTime(d.Month);
        });

        x.domain(d3.extent(data, function(d) { return d.Month; }))
        y.domain([0, 20]);

        svg.append('path')
            .data([data])
            .attr('class', 'uit-visual__chart-line')
            .attr('d', valueLine);

        svg.append('g')
            .attr('class', 'uit-visual__chart-axis uit-visual__chart-axis--x')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('class', 'uit-visual__chart-axis uit-visual__chart-axis--y')
            .attr('transform', `translate(20, 0)`)
            .call(d3.axisLeft(y).tickValues([20, 15, 10, 5]));

        svg.append('line')
            .attr('class', 'uit-visual__chart-marker')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', y(0.2))
            .attr('y2', y(0.2));
    }
}
