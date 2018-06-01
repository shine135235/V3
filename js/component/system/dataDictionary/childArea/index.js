import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,Icon,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddChild from "./addChild";
import EditChild from "./editChild";
import config from '../../../../config';
import './childArea.less';

const Search = Input.Search;
const confirm = Modal.confirm;
export default class ChildArea extends Component{
    constructor(props){
        super(props)
        this.state={
            editLoading: false,
            editVisible: false,
            addVisible:false,
            record:[], 
            pageSize:10,
            pageNum:1,
            totalRecord:0,
            dataList:[],
            showBetchDel:"none",
            selectedRowKeys:[],
        }
    }
    columns = [{
        title:"片区名称",
        dataIndex:"areaName",
        key:"areaName"
      },{
        title:"代号",
        dataIndex:"code",
        key:"code"  
      },{
        title:"描述",
        dataIndex:"areaDesc",
        key:"areaDesc"  
      },{
        title:"操作",
        key:"action",
        render:(text, record) => (
            <span>
                <a href="#"  onClick= {this.showModal.bind(this,record)}>编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick = {this.Delet.bind(this,record.id)}>删除</a>
            </span>
        ), 
    }];
    success = (success) => {
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    showModal = (record) =>{
        this.setState({record,editVisible:true});
    }
    onShowSizeChange = (current, size) =>{
        this.getDataList({pageNum:current,pageSize:size})
    } 
    onChange = (page, pageSize) =>{
        this.getDataList({pageNum :page,pageSize:pageSize})
    }
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    }
    getDataList =({pageNum=1,pageSize=10}) =>{
        $axios.get(`${config.api_server}/sys/area/list?pageNum=${pageNum}&pageSize=${pageSize}`).then(res =>{
            //eslint-disable-next-line
            console.log('ssssssssssssss',res)
                if(res.data.page.datas){
                    this.setState({dataList:res.data.page.datas})
                    this.setState({totalRecord:res.data.page.totalRecord})
                }       
        })
    }
    Delet = (record) => {
        //eslint-disable-next-line
         console.log("ssssss",record);
        confirm({
            title: '删除操作',
            content: '确定要删除选中信息吗?',
            okText: '是',
            okType: 'danger',
            cancelText: '否',  
            onOk:() => {
                this.setDelet(record)
            },
            onCancel:() => {
                 //eslint-disable-next-line
            //   console.log('Cancel');
            },
          });
          this.setState({
            addVisible: false,
            editVisible: false,
           });
    }
    onSelectedChange = (selectedRowKeys, selectedRows) => {
        let selectedRowIds = [];
        //eslint-disable-next-line
        //console.log('selectedRowKeysselectedRowKeys',selectedRowKeys);
        //eslint-disable-next-line
        //console.log('selectedRowsselectedRows',selectedRows);
        for( let i = 0;i<selectedRows.length;i++){
            let item = selectedRows[i];
            selectedRowIds.push(item.id);
        }
        selectedRowIds = selectedRowIds.join(",");
        if(selectedRows.length > 0){
            this.setState({
              showBetchDel:"block",
            })
        }else{
            this.setState({
              showBetchDel:"none",
            })
        }
        this.setState({
          selectedRowKeys,
          delIdsLength:selectedRows.length,
          delIds:selectedRowIds,
        })
      }
    setDelet = (pid) =>{
        let ids = pid.split(",");
       $axios({
           url:`${config.api_server}/sys/area`,
           method:'delete',
           headers: {
               'Content-type': 'application/json;charset=UTF-8'
           },
           data:{
               "list":ids
           }
           }).then((res) => {
               let datas = res.data.success;
               if(datas){
                    this.setState({selectedRowKeys:[],showBetchDel:"none"})
                   this.getDataList({});
                   setTimeout(() => {
                    let success = "批量删除成功"
                    this.success(success);
                   }, 1000);
               }else{
                   setTimeout(() => {
                    let error = "批量删除失败"
                    this.error(error);
                   }, 1000);
               }
           })
   }
    componentDidMount(){
        this.getDataList({});
       
    }
    render(){
        const pagination = {
            showQuickJumper:true,
            onShowSizeChange:this.onShowSizeChange,
            onChange:this.onChange,
            total:this.state.totalRecord,
            showTotal:this.showTotal,
            showSizeChanger:true,
            size:"small",
        }
        const { selectedRowKeys } = this.state;
        const rowSelection =  {
            selectedRowKeys,
            onChange: this.onSelectedChange,
        }
        return (
            <div className='data-class-overKnow'>
                {/* <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>片区管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }}/>
                        <Button >刷新</Button>
                        <AddChild getDataList = {this.getDataList}/>
                    </div>
                </div> */}
                <div className = 'eventTitle'>
                        <AddChild getDataList = {this.getDataList}/>     
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}>刷新</Button>
                        <div className = "eventTitleSearch"  style={{ width: "20%" }}>
                            <Search placeholder="搜索"  style={{ width: "100%" }} onSearch={this.onSearch}/>                          
                        </div>
                </div>
                <div className="slaManagement_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                        <Icon type="check-circle" />
                        <span className="slaManagement_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                        <span className='slaManagement_Betch_Delete_btn' onClick={this.Delet.bind(this,this.state.delIds)} style = {{"color":"red"}}>批量删除</span>
                    </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.dataList}  pagination = {pagination} columns={this.columns} rowSelection = {rowSelection}  />          
                    </LocaleProvider>                    
                    <EditChild  record={this.state.record} editVisible = {this.state.editVisible} getDataList = {this.getDataList} changeT = {this.changeT}/>
                </div>
            </div>
        )
    }
}