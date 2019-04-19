import * as d3 from 'd3';

let svg, ctx;

let data = [
  {
    "Month": "2016 05",
    "Value": 3.07
  },
  {
    "Month": "2016 06",
    "Value": 2.407875
  },
  {
    "Month": "2016 07",
    "Value": 10.91928571
  },
  {
    "Month": "2016 08",
    "Value": 12.7998
  },
  {
    "Month": "2016 09",
    "Value": 8.409444444
  },
  {
    "Month": "2016 10",
    "Value": 14.92466667
  },
  {
    "Month": "2016 11",
    "Value": 16.15166667
  },
  {
    "Month": "2016 12",
    "Value": 10.2365
  },
  {
    "Month": "2017 01",
    "Value": 19.0214
  },
  {
    "Month": "2017 02",
    "Value": 1.983333333
  },
  {
    "Month": "2017 03",
    "Value": 2.74
  },
  {
    "Month": "2017 04",
    "Value": 10.44911111
  },
  {
    "Month": "2017 05",
    "Value": 1.762
  },
  {
    "Month": "2017 06",
    "Value": 4.943625
  },
  {
    "Month": "2017 07",
    "Value": 3.851428571
  },
  {
    "Month": "2017 08",
    "Value": 5.004333333
  },
  {
    "Month": "2017 09",
    "Value": 8.5437
  },
  {
    "Month": "2017 10",
    "Value": 5.8602
  },
  {
    "Month": "2017 11",
    "Value": 23.4595
  },
  {
    "Month": "2017 12",
    "Value": 2.7885
  },
  {
    "Month": "2018 01",
    "Value": 6.748542857
  },
  {
    "Month": "2018 02",
    "Value": 4.687811111
  },
  {
    "Month": "2018 03",
    "Value": 1.2974875
  },
  {
    "Month": "2018 04",
    "Value": 2.8718
  },
  {
    "Month": "2018 05",
    "Value": 0.5310428571
  },
  {
    "Month": "2018 06",
    "Value": 0.57336
  },
  {
    "Month": "2018 07",
    "Value": 0.5909666667
  },
  {
    "Month": "2018 08",
    "Value": 1.4958625
  },
  {
    "Month": "2018 09",
    "Value": 2.49117
  },
  {
    "Month": "2018 10",
    "Value": 8.26739
  },
  {
    "Month": "2018 11",
    "Value": 1.85
  },
  {
    "Month": "2018 12",
    "Value": 7.613
  },
  {
    "Month": "2019 01",
    "Value": 4.1706
  },
  {
    "Month": "2019 02",
    "Value": 1.473285714
  },
  {
    "Month": "2019 03",
    "Value": 1.55
  }
]

export default {
    init: function() {
        $(document).ready(function() {
            this.createChart();
        }.bind(this));
    },

    createChart: function() {
        $('.content__main-column--interactive p:eq(1)').after('<div class=\'uit-visual__chart\'></div>');

        const margin = {top: 10, right: 0, bottom: 30, left: 30};
        const width = $('.uit-visual__chart').width() - margin.left - margin.right;
        const height = $('.uit-visual__chart').height()- margin.top - margin.bottom;
        svg = d3.select('.uit-visual__chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

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
        y.domain([0, 25]);

        svg.append('g')
            .attr('class', 'uit-visual__chart-axis uit-visual__chart-axis--x')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)));

        svg.append('g')
            .attr('class', 'uit-visual__chart-axis uit-visual__chart-axis--y')
            .call(d3.axisLeft(y).tickFormat(function(d) {
                if (!Number.isInteger(d)) {
                    const decimalFormatter = d3.format(".1");
                    d = decimalFormatter(d);
                }
                return d;
            }).tickValues([25, 20, 15, 10, 5, 0.2]));

        svg.append('line')
            .attr('class', 'uit-visual__chart-marker')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', y(0.2))
            .attr('y2', y(0.2));

        svg.selectAll('.uit-visual__chart-tick')
            .data([25, 20, 15, 10, 5])
            .enter()
            .append('line')
            .attr('class', 'uit-visual__chart-tick')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', function(d) { return y(d) })
            .attr('y2', function(d) { return y(d) });

        svg.append('path')
            .data([data])
            .attr('class', 'uit-visual__chart-line')
            .attr('d', valueLine);
    }
}
