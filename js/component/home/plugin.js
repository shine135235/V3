import React,{Component} from 'react';
import axios from 'axios';
import echarts from 'echarts';
import moment from 'moment';
import { Map,Marker} from 'react-amap';
import {Icon,Slider,Table,Progress,Spin,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../config'


const columns = [{
    title: '运维单位',
    dataIndex: 'name',
    className:'home-td',
    align:'center',
    width:450
  }, {
    title: '工单总数',
    dataIndex: 'all',
    className:'home-td',
    align:'center',
    width:300
  }, {
    title: '处理中',
    dataIndex: 'notfinish',
    className:'home-td',
    align:'center',
    width:300
  }, {
    title: '已完成',
    dataIndex: 'finish',
    className:'home-td',
    align:'center',
    width:300
  }, {
    title: '完成率',
    dataIndex: 'rank',
    className:'home-td',
    align:'center',
    width:300,
    render:(text,record)=>(
        <Progress style={{width:'91%'}} percent={parseInt(((record.finish/record.all)*100).toFixed(2))} status='active' />
    )
  }];
const Time=new Date();
export default class Allin extends Component{
    constructor(props){
        super(props)
        this.state={
            zoom:11,
            gague:0,
            annular:[],
            makers:[],
            event:[],
            center:{},
            maparea:'',
            topxData:[],
            eventtop:[],
            spanDisplay:true,
            strTime:moment(Time).format('YYYY/MM/DD'),
            endTime:moment(Time).format('YYYY/MM/DD'),
            tableData:[],
            dataId:'',
            loading:true,
            show:'none',
            nameShow:false,
            loadIframe:false,
            sliderShow:false,
            iwPosition:{
                longitude: 120,
                latitude: 30
            },
            iwVisible:false,
            iwContent:'1111111111111'
        }
        this.loopFunction=() =>{
            this.getData(moment(this.state.strTime).format('YYYY-MM-DD'),moment(this.state.endTime).format('YYYY-MM-DD'))
        }
        this.loopData=setInterval(this.loopFunction,10000)
        this.districtEvent={
            created:(amap) =>{
                     const _this=this;
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
                                        strokeWeight: 0,
                                        path: item,
                                        fillOpacity: 0.75,
                                        fillColor: '#3aa3ff',
                                        strokeColor: 'rgba(0,0,0,0)'
                                    })
                                    polygons.push(polygon)
                                })
                            }
                        })
                    });
                //装载地图风格
                amap.setMapStyle('amap://styles/905e0a8dcd491635342909768bb07b3e');
                window.AMap.event.addListener(amap,'zoomend',function(){
                    let zooms=amap.getZoom()
                     _this.setState({
                         zoom:zooms
                     })
                     if(zooms>11){
                         _this.setState({
                             nameShow:true
                         })
                     }else{
                        _this.setState({
                            nameShow:false
                        })
                     }
                })
            }
        }
        this.eventIw={
            open: () => {console.log('InfoWindow opened')},
            close: () =>{
                this.setState({
                    iwVisible:false
                })
            },
        }
        this.markerEvent={
            click:(marker) =>{
                 this.setState({
                     iwPosition:marker.target.getPosition(),
                     iwVisible:true,
                     iwContent:marker.target.Nh.extData
                 })
            },
            mouseover:(e) =>{
                const marker=e.target;
                if(this.state.zoom<=11){
                    marker.render(this.markerHoverRender)
                }
            },
            mouseout:(e) => {
                const marker = e.target;
                if(this.state.zoom<=11){
                    marker.render(this.markerRender)
                }
            }
        }
    }
    changeChart=(param) =>{
        axios.get('/data/school.json',{
            id:param
        }).then(res =>{
            this.setState({
                center:res.data.center,
                makers:res.data.makers
            })
        })
    }
    getData=(st,et) =>{
        axios.get(`${config.api_server}/homepages/details`,{
            params:{
                startDate:moment(st).format('YYYY-MM-DD'),
                endDate:moment(et).format('YYYY-MM-DD'),
                faultCategoryId:this.state.dataId
            }
        }).then(res =>{
            if(res.data==null){
                this.setState({
                    gague:0,
                    annular:[],
                    makers:[],
                    event:[],
                    center:{
                        longitude: 116.491291, 
                        latitude: 39.940031
                    },
                    maparea:'朝阳区',
                    topxData:[],
                    topyData:[],
                    tableData:[],
                    eventTotal:[]
                })
            }else{
                this.setState({
                    gague:res.data.gague,
                    annular:res.data.annular,
                    makers:res.data.makers,
                    event:res.data.event,
                    center:res.data.center,
                    maparea:res.data.maparea,
                    topxData:res.data.eventtop.xData,
                    topyData:res.data.eventtop.yData,
                    tableData:res.data.table,
                    eventTotal:res.data.eventtopTotal,
                    homePageScore:res.data.homePageScore
                })
            }
                
        }).then(()=>{
            let _this=this;
            let Gauge=echarts.init(this.gauge);
            let gagueOption = {
                title:{
                    left:'center',
                    top:'5%',
                    text:'综合服务满意度',
                    textStyle:{
                        fontSize:16,
                        color:'#ffffff'
                    },
                    zlevel:1
                },
                tooltip : {
                    formatter: "{a}{b} : {c}分"
                },
                series: [
                    {
                        name: '满意度',
                        type: 'gauge',
                        radius:'85%',
                        detail: {
                            formatter:`${this.state.gague.toFixed(1)}分`,
                            offsetCenter:[0,'40%'],
                            color:'#fff'
                        },
                        center: ['50%', '60%'],
                        data:[{value:`${this.state.gague}`}],
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
            Gauge.setOption(gagueOption)
            let annularOption = {
                title:{
                    left:'center',
                    top:'1%',
                    text:'设备在线状态',
                    textStyle:{
                        fontSize:16,
                        color:'#d9e4f0'
                    }
                },
                grid:{
                    y:100,
                    y2:20
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
                        text:`设备总数\n${(this.state.annular.length>0?this.state.annular[0].value+(this.state.annular[1]?this.state.annular[1].value:0):0)}`,
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
                        data:this.state.annular,
                        labelLine:{
                            normal:{
                                length:20
                            }
                        }
                    }
                ],
                color:['#3aa1ff','#fad336','#ef617c']
            };
            if(this.state.annular.length>0){
                let Annular=echarts.init(this.Annular);
                Annular.setOption(annularOption);
            }
            let eventOption = {
                title:{
                    left:'center',
                    top:'5%',
                    text:'事件大类统计',
                    textStyle:{
                        fontSize:16,
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
                        text:`总数量\n${this.state.eventTotal}`,
                        font: '18px Microsoft YaHei',
                        textAlign:'center'
                    },
                    onclick:function(param){
                       _this.setState({
                           dataId:param.data.id
                       })
                    }
                },
                series: [
                    {
                        name:'设备状态',
                        type:'pie',
                        hoverAnimation:false,
                        radius: ['55%', '40%'],
                        selectedMode: 'single',
                        data:this.state.event,
                        labelLine:{
                            normal:{
                                length:25
                            }
                        }
                    }
                ],
                color:['#3aa1ff','#fad336','#ef617c']
            };
            if(this.state.event.length>0){
                let EventObj=echarts.init(this.eventObj);
                EventObj.setOption(eventOption,true);
                EventObj.on('click',function(param){
                    console.log(param)            
                })
            }
            
            let eventTopOption={
                title:{
                    left:'center',
                    top:'5%',
                    text:'事件类型统计(TOP6)',
                    textStyle:{
                        fontSize:16,
                        color:'#d9e4f0'
                    },
                    zlevel:1
                },
                tooltip : {
                    formatter: "{b} : {c}"
                },
                grid: {
                    left:'5%',
                    right:'5%',
                    bottom:'8%'
                },
                xAxis: {
                    show:true,
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    nameTextStyle:{
                        color:'#ffffff'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#3aa0ff'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        show:false
                    }
                },
                yAxis: {
                    show:false,
                    type: 'category',
                    data: this.state.topxData
                },
                series: [
                    {
                        name: '2011年',
                        type: 'bar',
                        barWidth:15,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 20,
                                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                    offset: 0,
                                    color: '#3aa0ff'
                                }, {
                                    offset: 1,
                                    color: '#26cbcb'
                                }])
                            },
                        },
                        label:{
                            formatter:'{b}',
                            show:true,
                            position:'right',
                            color:'#fff'
                        },
                        data: this.state.topyData,
                    }
                ],
            };
            if(this.state.topyData.length>0 || this.state.topxData.length>0){
                let eventTop=echarts.init(this.eventTop);
                eventTop.setOption(eventTopOption,true);
                eventTop.on('click',function(param){
                    _this.setState({
                        dataId:param.data.id
                    })
                });
            }
            
        }).then(() =>{
            this.setState({
                loading:false,
                show:'block',
                loadIframe:true
            });
        })
    }
    daysInMonth=moment(Time,'YYYY-MM').subtract(1,'days').daysInMonth();
    prevMonth=moment(Time).subtract(this.daysInMonth,'days').format('YYYY-MM-DD');
    sliderShow=() =>{
        this.setState({
            spanDisplay:false,
            sliderShow:true
        })
    }
    timeChange=(value) =>{
        this.setState({
            strTime:moment(this.prevMonth).add('days',value[0]).format('YYYY-MM-DD'),
            endTime:moment(this.prevMonth).add('days',value[1]).format('YYYY-MM-DD'),
            sliderShow:false,
            spanDisplay:true
        });
        this.getData(moment(this.prevMonth).add('days',value[0]).format('YYYY-MM-DD'),moment(this.prevMonth).add('days',value[1]).format('YYYY-MM-DD'))
    }
    tipFormatter=(value) =>(
        moment(this.prevMonth).add('days',value).format('MM-DD')
    );
    mousLeave=() =>{
        this.setState({
            sliderShow:false,
            spanDisplay:true
        })  
    }
    componentDidMount(){
        this.getData(moment(this.state.strTime).format('YYYY-MM-DD'),moment(this.state.endTime).format('YYYY-MM-DD'));
    }
    componentWillUnmount(){
        clearInterval(this.loopData)
    }
    markerRender=(extData) =>(
        extData.islast?<span className={`school-icon ${extData.level}`}><span className='school-name' style={{display:this.state.nameShow?'inline-block':'none'}}>{extData.name}</span><span className='event-num'>{extData.num}</span><span className={`animate-span b${extData.level}`}></span></span>:<span className={`school-icon ${extData.level}`}><span className='school-name' style={{display:this.state.nameShow?'inline-block':'none'}}>{extData.name}</span><span className='event-num'>{extData.num}</span></span>
    )
    markerHoverRender=(extData) =>(
        extData.islast?<span className={`school-icon ${extData.level}`}><span className='school-name' style={{display:'inline-block'}}>{extData.name}</span><span className='event-num'>{extData.num}</span><span className={`animate-span b${extData.level}`}></span></span>:<span className={`school-icon ${extData.level}`}><span className='school-name' style={{display:'inline-block'}}>{extData.name}</span><span className='event-num'>{extData.num}</span></span>
    )
    render(){
        const MonthMarks={};
        for(let i=1;i<=this.daysInMonth+1;i++){
            if(i==1){
                MonthMarks[i]=moment(this.prevMonth).add('days',i-1).format('MM-DD');
            }else if(Number.isInteger(i/5)){
                MonthMarks[i]=moment(this.prevMonth).add('days',i-1).format('MM-DD');
            }
        }
        const siderStyle={width:'85%',zIndex:'3',marginLeft:'7.5%',position:'relative',top:'-5px',display:`${this.state.sliderShow?'block':'none'}`}
        return(
            <div className='content'>
                <Spin style={{width:'100%',position:'absolute',top:'62px',bottom:'0',zIndex:'1009',backgroundColor:'#044699'}} size='large' spinning={this.state.loading}></Spin>
                <div className='charts-part'>
                <div className='view-charts'>
                <div className='view-left'>
                <div className='gauge' ref={(gauge) =>(this.gauge=gauge)}></div>
                {
                    this.state.annular.length>0?<div className='asset-runing' ref={(Annular) =>(this.Annular=Annular)}></div>:<Spin className='asset-runing' spinning={true} tip={`未检测到设备`} size='large' style={{paddingTop:'20%'}} />
                }
                </div>
                <div className='view-center'>
                <Map zoom={this.state.zoom} loading={<Spin spinning={true} />} amapkey='aebd33b15781df8815513afe16c4a4c6' theme='amap://styles/905e0a8dcd491635342909768bb07b3e' version='1.4.6' center={this.state.center} events={this.districtEvent}>
                    {
                        this.state.makers.map((item,key) =>(
                            <Marker key={key} render={this.markerRender} position={{longitude: item.lgt, latitude: item.lat}} events={this.markerEvent} extData={item}></Marker>
                        ))
                    }
                {/* <InfoWindow position={this.state.iwPosition} visible={this.state.iwVisible} content={this.state.iwContent} size={{width:200,height:100}} events={this.eventIw} offset={[0,-30]}></InfoWindow> */}
                </Map>
                </div>
                <div className='view-right'>
                    <div className='time-wrap' onMouseLeave={this.mousLeave}>
                        <div className='date-picker'>
                            <span onClick={this.sliderShow} style={{display:this.state.spanDisplay?'inline-block':'none'}}>
                                <Icon type="calendar" />　<span>{moment(this.state.strTime).format('MM/DD')} - {moment(this.state.endTime).format('MM/DD')}</span>
                            </span>
                            <Slider style={siderStyle}  range marks={MonthMarks} tipFormatter={this.tipFormatter} min={1}  max={this.daysInMonth} defaultValue={[1,this.daysInMonth]}  onAfterChange={this.timeChange} />
                        </div>
                    </div>
                    <div className='event-count'>
                    {
                        this.state.event.length>0?<div className='event-charts' ref={event=>(this.eventObj=event)}></div>:<Spin  className='event-charts' spinning={true} tip={`您选择的时间段内没有发生故障`} size='large' style={{paddingTop:'8%'}} />
                    }
                    </div>
                    {
                        this.state.topxData.length>0?<div className='event-top' ref={eventTop =>this.eventTop=eventTop}></div>:<Spin className='event-top' spinning={true} tip={`您选择的时间段内没有发生故障`} size='large' style={{paddingTop:'18%'}} />
                    }
                </div>
                </div>
                <div className='table-part'>
                <LocaleProvider locale={zhCN}>
                <Table columns={columns} dataSource={this.state.tableData} pagination={false} scroll={{ y: 225,x:'100%' }} className='home-table' rowClassName={() =>{
                    return 'home-tr'
                }}/>
                </LocaleProvider>
                </div>
                </div>
                {
                    this.state.loadIframe?<iframe src={this.props.ifsrc} style={{"display":"none"}}></iframe>:null
                }
            </div>
        )
    }
}