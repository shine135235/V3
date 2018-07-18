import React,{Component} from 'react'
import { Menu, Popover, Button,LocaleProvider, Form, DatePicker,Icon,Pagination } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import axios from 'axios';
import moment from 'moment';
import Echarts from './echarts'
import './index.less';
import config from '../../../config';


const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
export default class PerformanceManage extends Component{
      state={
        visible:false,
        menuData:[],
        menuList:[],
        openKeys:["sub1"],
        openKey:0,
        statisticType:'response',
        initialmenu:'',
        timeChange:"最近一周",
        total:null,
        startTime:"",
        endTime:"",
        pageSize:12,
        rootSubmenuKeys:[],
        type:"",
        pageNum:1,
        ecData:[]
    }
      componentDidMount (){
        this.getMenuList()
    }
    getMenuList = (statisticalDimension,statisticType,startTime,endTime,pn) =>{
        axios.get("../data/achievementsMenu.json").then((res) =>{
            let startTime = "";
            let endTime = "";
            endTime = moment().format("YYYY-MM-DD HH:mm:ss");
            startTime = moment().subtract(6, 'days').format("YYYY-MM-DD 00:00:00"); 
            let rootSubmenuKeys = [];
            for(let i = 0;i<res.data[0].dataClass.length;i++){
                rootSubmenuKeys.push(res.data[0].dataClass[i].id)
            }
            //console.log("rootSubmenuKeysrootSubmenuKeys",rootSubmenuKeys)
            this.setState({
                    menuData:res.data,
                    menuList:res.data[0].dataClass,
                    initialmenu:res.data[0].dataClass[0].childList[0].menu,
                    timeChange:"最近一周",
                    startTime:startTime,
                    endTime:endTime,
                    rootSubmenuKeys:rootSubmenuKeys
            })
            let initial = res.data[0].dataClass[0].childList;
             this.getArchiveRateStatistic(initial[0].statisticalDimension,initial[0].type,startTime,endTime,pn?pn:1)
        })
    }
    getArchiveRateStatistic = (statisticalDimension,statisticType,startTime,endTime,pn) =>{
        axios.get(`${config.api_server}/performance/archiveRateStatistic/${statisticType}/${statisticalDimension}`,{
            params:{
                startTime:startTime,
                endTime:endTime,
                pageNum:pn,
                pageSize:12,
            }
        }).then(res =>{
           this.setState({
               ecData:res.data.page.datas,
               pageNum:res.data.page.pageNum,
            //    pageSize:res.data.page.pageSize,
               total:res.data.page.totalRecord,
               type:res.data.data

            })
        })
    }
    handleClick = (e) =>{
        let startTime = "";
        let endTime = "";
        endTime = moment().format("YYYY-MM-DD HH:mm:ss");
        startTime = moment().subtract(6, 'days').format("YYYY-MM-DD 00:00:00"); 
        let openKeys = [];
        openKeys.push(e.keyPath[1])
        this.setState({
            openKey:e.item.props.id,
            openKeys:openKeys,
            initialmenu:e.item.props.children,
            statisticType:e.item.props.className,
            timeChange:"最近一周",
            startTime:startTime,
            endTime:endTime
        })
         this.getArchiveRateStatistic(e.item.props.id,e.item.props.className,startTime,endTime,1)
    }  
    changeTime = (e) =>{
        e.stopPropagation();
        if(this.state.visible == false){
            this.setState({ visible:true });
        }else if(this.state.visible == true){
            this.setState({ visible:false });
        }
    } 
    onTimeChange = (value, dateString) =>{
        if(dateString[0] !=""){
            let timeChange = dateString[0] + "至" +dateString[1]
            this.setState({timeChange:timeChange,startTime:dateString[0],endTime:dateString[1],visible:false})
           this.getArchiveRateStatistic(this.state.openKey,this.state.statisticType,dateString[0],dateString[1],1)
        }else{
            this.setState({timeChange:""})
        }
    }
    oneWeek = (e) =>{
        // e.stopPropagation();
        let timeChange = e;
        let startTime = "";
        let endTime = "";
         endTime = moment().format("YYYY-MM-DD HH:mm:ss");
        if(timeChange == "oneWeek"){
            timeChange = "最近一周"
            startTime = moment().subtract(6, 'days').format("YYYY-MM-DD 00:00:00"); 
        }else if(timeChange == "oneMonth"){
            timeChange = "最近一月"
            if(new Date().getMonth() + 1 === 1){
                startTime = new Date().getFullYear() - 1 +"-12"+ new Date().getDate() +" "+ "00:00:00"
            }else{
                let mon = new Date().getMonth();
                if(mon < 10){
                    mon = "0" + mon
                }
                startTime = new Date().getFullYear() +"-"+mon+"-"+ new Date().getDate() +" "+ "00:00:00";
            }    
        }else if(timeChange == "threeMonth"){
            timeChange = "最近三月"
            if(new Date().getMonth() -2 < 0){
                let mont = 9 + new Date().getMonth();
                startTime = new Date().getFullYear() - 1 +"-"+mont+ new Date().getDate() +" "+ "00:00:00"
            }else{
                let mon = new Date().getMonth() -2;
                if(mon < 10){
                    mon = "0" + mon
                }
                startTime = new Date().getFullYear()+"-"+mon+"-"+new Date().getDate()+" "+"00:00:00";
            } 
        }
        this.getArchiveRateStatistic(this.state.openKey,this.state.statisticType,startTime,endTime,1)
        this.setState({timeChange:timeChange,visible:false,startTime:startTime,endTime:endTime})
         
    }
    pageChange = (page) =>{
       // console.log("pagepage",page);
         this.getArchiveRateStatistic(this.state.openKey,this.state.statisticType,this.state.startTime,this.state.endTime,page)
    }
    onOpenChange = (openKeys) =>{
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.setState({ openKeys });
        } else {
          this.setState({
            openKeys: latestOpenKey ? [latestOpenKey] : [],
          });
        }
    }
    showTotal = (total) => {
        return `共 ${total} 条记录`
    }
    // onShowSizeChange = (current, size) =>{
    //     this.setState({pageNum:current})
    //     this.getDataList({pageNum:current,pageSize:size,searchparam:this.state.searchparam})
    // }
    render(){ 
        let content = (
            <LocaleProvider locale = {zhCN}>
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    <FormItem>
                        <Button className = "1" onClick = {this.oneWeek.bind(this,"oneWeek")} style = {{"marginRight":"8px"}}>最近一周</Button>
                        <Button className = "2" onClick = {this.oneWeek.bind(this,"oneMonth")} style = {{"marginRight":"8px"}}>最近一月</Button>
                        <Button className = "3" onClick = {this.oneWeek.bind(this,"threeMonth")}>最近三月</Button>
                    </FormItem>
                    <FormItem>
                            <RangePicker  onChange={this.onTimeChange}  format="YYYY-MM-DD HH:mm:ss" />            
                    </FormItem>
                </Form>
            </LocaleProvider>
        )
        //  console.log("this.state.menuList",this.state.menuList)
        // console.log("totaltotaltotaltotal",this.state.total)
        if(this.state.menuData.length >0){
            return(
                <div className='ach-content'>
                <div className = "ach-content-box">
                <div className='department'>
                    <Menu
                         mode="inline"
                          openKeys={this.state.openKeys}
                          onClick={this.handleClick}
                          onOpenChange={this.onOpenChange}
                          defaultSelectedKeys={['unitsResponse']}
                          defaultOpenKeys={['sub1']}
                         style={{ width: "100%" }}
                    >
                        {
                            this.state.menuList.map(item =>{
                                return(
                                    <SubMenu key={item.id} title={<span>{item.menu}</span>}>
                                        {
                                            item.childList.map(list =>{
                                                return(
                                                    <Menu.Item key={list.key} id={list.statisticalDimension} className = {list.type}>{list.menu}</Menu.Item>
                                                )
                                            })
                                        }
                                    </SubMenu>
                                )
                            })
                        }
                    </Menu>
                </div>
                <div className='ach-group'>
                   <div className = "ach-group-title">
                        <div className = "ach-group-titlename">
                            {this.state.initialmenu}
                        </div>
                        <div className = "ach-group-titleTime">
                            <Popover placement="bottom"  
                            content={content}
                            trigger="click"
                            visible={this.state.visible}
                            // onVisibleChange={this.handleVisibleChange}
                            >
                                <Button  onClick = {this.changeTime}>{this.state.timeChange}<Icon type = "edit"/></Button>    
                            </Popover>  
                        </div>
                   </div>
                   <div style = {{"width":"100%","height":"93.5%"}}>
                       <div style = {{"width":"100%","height":"90%"}}>
                            <Echarts ecData = {this.state.ecData} type = {this.state.type}/>
                       </div>
                       <div style = {{"float":"right","marginTop":"6px"}}>
                            <LocaleProvider locale = {zhCN}>
                                <Pagination current= {this.state.pageNum} size="small" total={this.state.total}  onShowSizeChange={this.onShowSizeChange} showTotal={this.showTotal} onChange={this.pageChange}  position = {'both'} pageSize = {12} /> 
                            </LocaleProvider>
                        </div>
                   </div>
                </div>
            </div>
            </div>
            )
        }else{
            return null
        }        
    }
}
