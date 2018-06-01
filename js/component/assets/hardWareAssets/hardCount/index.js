import React, { Component } from "react";
import {  Button } from 'antd';
import $axios from "axios";
import * as echarts from "echarts";
import config from '../../../../config';

export default class AppCensus extends Component{
    state = {
        filterVisible:false,
    }
    initEcharts=(eleId,typeName,itemDate,itemData)=>{
        //eslint-disable-next-line
        console.log(eleId);
        let myChart = echarts.init(document.getElementById(`${eleId}`));
        //eslint-disable-next-line
        console.log(myChart);
        let option = {
            color:["red"],
            title : {
                text: `${typeName}`,
                subtext: '(单位：人数)'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['装机量']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : itemDate
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}'
                    }
                }
            ],
            series : [
                {
                    name:'装机量',
                    type:'line',
                    data:itemData,
                },
            ]
        };
        myChart.setOption(option);
    }
    initEchartF = (e) => {
        let eleName = e.target.innerText.replace(" ","");
        // this.initEcharts("appCensusCharts",eleName);
        if(eleName == "上一周"){
            eleName = "lastWeek";
        }else if(eleName == "上一月"){
            eleName = "lastMonth";

        }else if(eleName == "上一季"){
            eleName = "lastQuarter";

        }else if(eleName == "上一年"){
            eleName = "lastYear";

        }
        this.getData({btnType:eleName});
    }
    getData = ({btnType = "",startTime = "",endTime = ""}) => {
        /**
         * @param btnType 按钮类型 如 上一周
         * @param startTime 开始时间 筛选的时候用
         * @param endTime 结束时间 筛选的时候用
         */
        $axios.get(`${config.api_server}/queryAppInstall?buttonType=${btnType}&startTime=${startTime}&endTime=${endTime}`)
            .then((json)=>{
                //eslint-disable-next-line
                console.log(json);
                let result = json.data.dataArray;
                //eslint-disable-next-line
                console.log(result);
                let dataArr = [];
                let dateArr = [];
                for(let i = 0;i<result.length;i++){
                    let itemData = result[i].phoneNum;
                    let itemDate = result[i].date;
                    dataArr.push(itemData);
                    dateArr.push(itemDate);
                }
                if(btnType == "lastWeek"){
                    btnType = "上一周";
                }else if(btnType == "lastMonth"){
                    btnType = "上一月";
                }else if(btnType == "lastQuarter"){
                    btnType = "上一季";
                }else if(btnType == "lastYear"){
                    btnType = "上一年";
                }else if(btnType == ""){
                    btnType = '筛选'
                }
                this.initEcharts("appCensusCharts",`${btnType}`,dateArr,dataArr);
            });
    }
    componentDidMount() {
        //上周 lastWeek
        //上月 lastMonth
        //上季度 lastQuarter
        //上年 lastYear
        // let date = new Date();
        // let year = date.getFullYear();
        // let month = date.getMonth() + 1;
        // let day = date.getDate();  
        // let dateValue = year + '-' + month + '-' + day;     
        // let date1 = new Date();
        // let year1 = date1.getFullYear();
        // let month1 = date1.getMonth() + 1;
        // let day1 = date1.getDate();  
        // let dateValue1 = year1 + '-' + month1 + '-' + day1; 
        this.getData({btnType:"lastWeek"});
    }
    
    render(){
        return (
            <div className='appCensusCom'>
                <div className='app-censuscom-title'>
                    <div className="appCensusTitle">APP装机量统计</div>
                    <div className="appCensusTopBtn_group">
                        <Button onClick={this.initEchartF}>上一周</Button>
                        <Button onClick={this.initEchartF}>上一月</Button>
                        <Button onClick={this.initEchartF}>上一季</Button>
                        <Button onClick={this.initEchartF}>上一年</Button>
                    </div>
                </div>
                <div className='appCensus-charts-wrap'>
                    <div id="appCensusCharts" className="appCensusCharts"></div>
                </div>
            </div>
        )
    }
}
