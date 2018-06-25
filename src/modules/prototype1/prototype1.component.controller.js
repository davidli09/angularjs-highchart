const util = require('_util');

module.exports = (class controller extends require('./../common/base-class') {
    $config = {
        scrollbarsTiles: {
            autoHideScrollbar: true,
            axis: 'y',
            advanced: {
                updateOnContentResize: true
            },
            callbacks: {
                onScroll: function () {
                    // TODO do not access DOM directly, this logic must be wrapped into "directive"
                    // const indexComponentTagName = `${util.camelToDash(require('./../index/index.component').$name)}`;
                    // angular.element(indexComponentTagName)[this.mcs.top ? 'addClass' : 'removeClass']('narrow-bar');
                }
            }
        }
    };

    static $inject = ['$state'];

    constructor($state) {
        super({$state});

        this._initChartsData();

        this._refreshPayout(this.$s.payoutInfo.current);
        
        const appName = `${util.camelToDash(require('./../app/app.component').$name)}`;
        var app = angular.element(appName);
        app.removeClass('blue-mode');
        app.removeClass('index-mode');
        app.addClass('green-mode');
    }

    showPayDetail(params) {
        this.$i.$state.go('explorer.item', {
                                            id: 0,
                                            extraInfo: params
                                        });
    }

    _initChartsData() {
        const state = this.$s;

        state.payoutInfo = {
            categories: ["Jun 15", "Jul 15", "Aug 15", "Sep 15", "Oct 15", "Nov 15", "Dec 15",
                         "Jan 16", "Feb 16", "Mar 16", "Apr 16", "May 16"],
            values1: [1, 2, 3, 0.5, 1.5, 4, 2, 5, 2, 4, 2, 3],
            values2: [2, 4, 1, 1, 3, 2, 0.5, 0.5, 1, 1.5, 1, 1],
            current: 6
        };

        state.highchartsPayHistory = {
            options: {
                chart: {
                    type: 'column',
                    margin: [10, 0, 20, 25],
                    backgroundColor: "#F4F4F4"
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                legend: {
                    symbolHeight: 5,
                    symbolRadius: 3,
                    symbolWidth: 12,
                    symbolPadding: 3,
                    floating: true,
                    verticalAlign: 'top',
                    align: 'right',
                    itemStyle: {
                        color: "#6e6e6f",
                        fontSize: "11px",
                        fontWeight: "normal",
                        marginTop: "30px"
                    },
                    y: -100
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                }
            },
            xAxis: {
                categories: ['Jan 16', 'Feb 16', 'Mar 16', 'Apr 16', 'May 16', 'Jun 16'],
                tickLength: 0,
                lineWidth: 2,
                lineColor: "#e0e0e0",
                labels: {
                    style: {
                        color: "#343434",
                        fontWeight: "bold",
                        fontSize: "11px",
                        fontFamily: "Helvetica"
                    },
                    useHTML: true
                }
            },
            yAxis: {
                title: '',
                min: 0,
                gridLineWidth: 0,
                lineColor: "#e0e0e0",
                lineWidth: 2,
                tickInterval: 1,
                labels: {
                    style: {
                        color: "#a9a8a8",
                        fontWeight: "bold",
                        fontSize: "10px",
                        fontFamily: "Helvetica"
                    },
                    x: -5,
                    format: "{value}k",
                    useHTML: true
                }
            },
            series: [{
                name: 'Deductions',
                data: [2, 2, 3, 2, 8, 4],
                color: "#badada",
                borderColor: "#badada",
                borderRadiusTopLeft: '5px',
                borderRadiusTopRight: '5px'
            }, {
                name: 'Payout',
                data: [5, 3, 4, 7, 2, 9],
                color: "#7da8c6",
                borderColor: "#7da8c6"
            }]
        };
    }

    _refreshPayout(idx) {
        const highCharts = this.$s.highchartsPayHistory;
        const payoutInfo = this.$s.payoutInfo;

        highCharts.xAxis.categories = [];
        highCharts.series[0].data = [];
        highCharts.series[1].data = [];

        for (var i = 0; i < 6; i++) {
            highCharts.xAxis.categories.push(payoutInfo.categories[idx + i]);
            highCharts.series[0].data.push(payoutInfo.values1[idx + i]);
            highCharts.series[1].data.push(payoutInfo.values2[idx + i]);
        }
    }

    hcPrevPayout() {
        if (this.$s.payoutInfo.current == 0) return;
        this._refreshPayout(--this.$s.payoutInfo.current);
    }

    hcNextPayout() {
        if (this.$s.payoutInfo.current == 6) return;
        this._refreshPayout(++this.$s.payoutInfo.current);
    }
});
