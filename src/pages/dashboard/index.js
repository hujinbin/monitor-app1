import Chart from '../../components/chart';
import {GridComponent, LegendComponent, TitleComponent} from "echarts/components";
import {BarChart} from "echarts/charts";
import {useEffect, useState} from "react";
import {fetchNetWorkErrorOverview, fetchStablerOverview} from "../../services/dashboard";
import './styles/index.less';
import {message} from "antd";

const DomainId = localStorage.getItem('currentDomain') || '';

const getTopOptions = ({ titleText, data }) => {
    return {
        title: {
            text: titleText,
        },
        grid: {
            left: '5px',
            bottom: 20,
        },
        xAxis: {
            type: 'value',
        },
        yAxis: {
            type: 'category',
            show: false,
            data: data.map(item => item.Pathname),
            axisLabel: {
                formatter: '{value}'
            },
            triggerEvent: true,
        },
        series: [
            {
                data: data.map(item => item.Number),
                type: 'bar',
                barWidth:'10px',
                barGap:'20%',
                label: {
                    show: true,
                    formatter: function(params) {
                        const { dataIndex } = params;
                        const index = Math.abs(dataIndex - 10);
                        if (index === 1) {
                            return `{top1|Top 1} - {text|${params.name}}`
                        } else if (index === 2) {
                            return `{top2|Top 2} - {text|${params.name}}`
                        } else if (index === 3) {
                            return `{top3|Top 3} - {text| ${params.name}}`
                        } else {
                            return `Top ${index} - ${params.name}`;
                        }
                    },
                    color: '#000000',
                    position: [0, -15],
                    align: 'left',
                    rich: {
                        top1: {
                            color: '#f5222d',
                        },
                        top2: {
                            color: '#faad14',
                        },
                        top3: {
                            color: '#e3b14d',
                        },
                        text: {
                            color: '#000000'
                        }
                    }
                }
            }
        ]
    }
}

function Dashboard() {
    const [networkOptions, setNetworkOptions] = useState({});
    const [stableOptions, setStableOptions] = useState({});

    const copy = async text => {
        if ('clipboard' in navigator) {
            message.success('复制成功！');
            return await navigator.clipboard.writeText(text);
        } else {
            message.success('复制成功！');
            return document.execCommand('copy', true, text);
        }
    }

    const handleClick = async params => {
        await copy(params.name)
    }

    const eventObj = {
        'click': handleClick,
    }

    useEffect(() => {
        fetchNetWorkErrorOverview({
            DomainId,
        }).then(res => {
            const data = res.data.data || [];
            setNetworkOptions(getTopOptions({titleText: '网络异常接口TOP 10', data}));
        })
    }, [])

    useEffect(() => {
        fetchStablerOverview({
            DomainId,
        }).then(res => {
            const data = res.data.data || [];
            setStableOptions(getTopOptions({titleText: '网络稳定接口TOP 10', data}));
        })
    }, [])


    return (
        <div className={'chart-wrapper'}>
            <div className={'chart-wrapper-item'}>
                <Chart style={{ height: '400px' }} components={[GridComponent, LegendComponent, BarChart, TitleComponent]} options={stableOptions} events={eventObj}/>
            </div>
            <div className={'chart-wrapper-item'}>
                <Chart style={{ height: '400px' }} components={[GridComponent, LegendComponent, BarChart, TitleComponent]} options={networkOptions} events={eventObj}/>
            </div>
        </div>
    )
}

export default Dashboard;
