import React,{Component} from 'react';
import echarts from 'echarts';
import {Icon,Slider} from 'antd';
import { Map,Marker } from 'react-amap';


export class Gauge extends Component{
    constructor(props){
        super(props)
        this.state={
            gague:0
        }
    }
    componentWillReceiveProps(){
        this.setState({
            gague:this.props.gauge
        })
    }
    componentDidMount(){
        let Gauge=echarts.init(this.gauge);
        let option = {
            title:{
                left:'center',
                top:'35%',
                text:'综合服务满意度',
                textStyle:{
                    color:'#d9e4f0'
                },
                zlevel:1
            },
            grid:{
                y:100
            },
            tooltip : {
                formatter: "{a}{b} : {c}%"
            },
            series: [
                {
                    name: '满意度',
                    type: 'gauge',
                    radius:'100%',
                    detail: {
                        formatter:'{value}%',
                        offsetCenter:[0,'40%'],
                        color:'#fff'
                    },
                    center: ['50%', '60%'],
                    data:[{value:50}],
                    axisLine: {  
                        show: false,
                        lineStyle: {  
                            width: 20, // 这个是修改宽度的属性  
                            color: [[0.2, '#f3627a'], [0.8, '#3aa1ff'], [1, '#4ccb72']]
                        }   
                    },
                    axisTick:{
                        show:false//刻度
                    },
                    splitLine: {
                        show: false//分割线
                    },
                    axisLabel: {
                        distance: 0,
                        fontSize: 12,
                    },
                    pointer: {
                        show: true,
                        length: '60%',
                        width: 5,
                    }
                }
            ]
        };
        Gauge.setOption(option)
    }
    render(){
        return(
            <div className='gauge' ref={(gauge) =>(this.gauge=gauge)}></div>
        )
    }
}


export class AssetRuning extends Component{
    componentDidMount(){
        let Annular=echarts.init(this.Annular);
        let option = {
            title:{
                left:'center',
                top:'5%',
                text:'设备在线状态',
                textStyle:{
                    color:'#d9e4f0'
                }
            },
            tooltip:{
                formatter:'{b} : {c}\n占比 : {d}%'
            },
            graphic:{
                type: 'text',
                left: 'center',
                top: 'middle',
                style:{
                    fill:'#fff',
                    text:`设备总数\n1100`,
                    font: '18px Microsoft YaHei',
                    textAlign:'center'
                }
            },
            series: [
                {
                    name:'设备状态',
                    type:'pie',
                    hoverAnimation:false,
                    radius: ['65%', '55%'],
                    selectedMode: 'single',
                    data:[
                        {value:335, name:'在线'},
                        {value:310, name:'离线'},
                        {value:234, name:'未检测'},
                    ]
                }
            ],
            color:['#3aa1ff','#fad336','#ef617c']
        };
        Annular.setOption(option);
    }
    render(){
        return(
            <div className='asset-runing' ref={(Annular) =>(this.Annular=Annular)}></div>
        )
    }
}

export class MapView extends Component{
    constructor(props){
        super(props)
        this.state={
            center:{
                longitude: 116.405285, 
                latitude: 39.904989
            }
        }
        this.districtEvent={
            created:(amap) =>{
                    amap.plugin('AMap.DistrictSearch', function() {
                        //实例化DistrictSearch
                        let district=new window.AMap.DistrictSearch({
                            extensions: 'all',  //返回行政区边界坐标组等具体信息
                            level: 'city'  //查询行政级别为 市
                        })
                        district.search('朝阳区',function(status, result){
                            let bounds=result.districtList[0].boundaries;
                            let polygons=[];
                            if(bounds){
                                bounds.map(item =>{
                                    let polygon=new window.AMap.Polygon({
                                        map:amap,
                                        strokeWeight: 1,
                                        path: item,
                                        fillOpacity: 0.7,
                                        fillColor: '#CCF3FF',
                                        strokeColor: '#CC66CC'
                                    })
                                    polygons.push(polygon)
                                })
                            }
                        })
                    });
            }
        }
    }
    componentDidMount(){
       
    }
    render(){
        return(
            <Map zoom={14} amapkey='218a33f97d6b2d88dd32cb52fb9c2785' version='1.4.6' center={this.state.center} events={this.districtEvent}>
            <Marker position={{longitude: 116.405285, latitude: 39.904989}}>
             <span className='school-name'>这个学校</span>
             <span className='school-icon'></span>
            </Marker>
            </Map>
        )
    }
}


export class EventCount extends Component{
    componentDidMount(){
        let EventObj=echarts.init(this.eventObj);
        let option = {
            title:{
                left:'center',
                top:'5%',
                text:'事件大类统计',
                textStyle:{
                    color:'#d9e4f0'
                }
            },
            tooltip:{
                formatter:'{b} : {c}\n占比 : {d}%'
            },
            series: [
                {
                    name:'设备状态',
                    type:'pie',
                    hoverAnimation:false,
                    radius: ['65%', '50%'],
                    selectedMode: 'single',
                    data:[
                        {value:335, name:'在线',id:'222'},
                        {value:310, name:'离线',id:'333'},
                        {value:234, name:'未检测',id:'444'}
                    ]
                }
            ],
            color:['#3aa1ff','#fad336','#ef617c']
        };
        EventObj.setOption(option);
        EventObj.on('click',function(param){
            console.log(param)
        })
    }
    render(){
        return(
            <div className='event-count'>
            <div className='date-picker'><Icon type="calendar" />　05/24 - 06/24
            <Slider range min={526}  max={626} defaultValue={[20, 50]} />
            </div>
            <div className='event-charts' ref={event=>(this.eventObj=event)}></div>
            </div>
        )
    }
}