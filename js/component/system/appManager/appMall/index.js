import React , { Component } from "react";
import { Button , Input , LocaleProvider , Pagination,Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $axios from "axios";
import CardGroups from "./cardGroups"
import AddAppMall from "./addAppMall/index"
import EditAppMall from "./editAppMall/index"
import config from '../../../../config';
import './index.less'

const Search = Input.Search;
export default class AppMall extends Component {
    state={
        pageType:'list',
        listData:[],
        totalRecord:0,
        rowId:'',
        pageNum:1,
        pageSize:10,
        searchVal:'',
    }
    getListData = ({pageNum = this.state.pageNum,pageSize = this.state.pageSize,searchVal = this.state.searchVal}) => {
        $axios.get(`${config.api_server}/app/goodsList?pageNum=${pageNum}&pageSize=${pageSize}&mohu=${searchVal}`).then((json) => {
            // eslint-disable-next-line
            console.log(json);
              let listData = json.data.page.datas;
              let totalRecord = json.data.page.totalRecord;
              this.setState({
                listData,
                totalRecord,
            })
        })
      }
    componentDidMount(){
        this.getListData({})
    }
    searchFunc = (value) => {
        //eslint-disable-next-line
        console.log(value);
        this.setState({
            searchVal:value
        })
        this.getListData({searchVal:value});
    }
    showTotal = (total) => {
        return `共 ${total} 条记录 `
    }
    changeShowPage = ({pageType = "list",rowId = ''}) => {
        this.setState({
            pageType,
            rowId,
        })
    }
    onChange = (page, pageSize) => {
        this.setState({
            pageNum:page,pageSize:pageSize
        })
        this.getListData({pageNum:page,pageSize:pageSize});
    }
    onShowSizeChange = (current, size) =>{
        this.setState({
            pageNum:current,pageSize:size
        })
        this.getListData({pageNum:current,pageSize:size});
    }
    refresh = () =>{
        this.setState({searchVal:""})
        this.getListData({ pageNum:1,pageSize:10,searchVal:''})
    }
    render(){
        if(this.state.pageType=='list'){
            return(
                <div className='appMall'>
                    <div className='appMall_topBtns'>
                        <Button type="primary" icon="plus" onClick={this.changeShowPage.bind(this,{pageType:"add"})}>新增</Button>
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}><Icon type="reload"/></Button>
                        <Search
                            placeholder="请输入..."
                            style={{ 'width': '20%' }}
                            onSearch={this.searchFunc}
                        />
                    </div>
                    <CardGroups changeShowPage = {this.changeShowPage} listData = {this.state.listData} getListData = {this.getListData}/>
                    <div className='appMall_Pagination'>
                        <LocaleProvider locale={zhCN}>
                            <Pagination
                                size='small'
                                total={this.state.totalRecord}
                                // showSizeChanger={true}
                                showQuickJumper={true}
                                showTotal={this.showTotal}
                                onChange={this.onChange}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        </LocaleProvider>
                    </div>
                </div>
            )
        }else if(this.state.pageType == "add"){
            return(
                <AddAppMall changeShowPage = {this.changeShowPage} getListData = {this.getListData}/>
            )
        }else{
            return(
                <EditAppMall changeShowPage = {this.changeShowPage} rowId = {this.state.rowId} getListData = {this.getListData}/>
                // <div>bianji</div>
            )
        } 
    }
}
