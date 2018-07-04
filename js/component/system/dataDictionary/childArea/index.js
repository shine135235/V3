import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,Icon,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AuthPower from '../../../authpower';
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
            param:""
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
                <AuthPower>
                    <a href="#"  god = "ny-areaEdit" onClick= {this.showModal.bind(this,record)}>编辑</a>
                </AuthPower>
                <span className="ant-divider" />
                <AuthPower>
                    <a href="#"  god = "ny-areaDelet" onClick = {this.Delet.bind(this,record.id)}>删除</a>
                </AuthPower>
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
        this.getDataList({pageNum:current,pageSize:size,param:this.state.param})
    } 
    onChange = (page, pageSize) =>{
        this.getDataList({pageNum :page,pageSize:pageSize,param:this.state.param})
    }
    showTotal = (total) => {
        return `共 ${total} 条记录 `
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    }
    getDataList =({pageNum,pageSize,param}) =>{
        $axios.get(`${config.api_server}/sys/area/list?pageNum=${pageNum}&pageSize=${pageSize}&param=${param}`).then(res =>{
            if(res.data.page){
                if(res.data.page.datas){
                    this.setState({dataList:res.data.page.datas,totalRecord:res.data.page.totalRecord,pageNum:pageNum})
                    // this.setState({totalRecord:res.data.page.totalRecord})
                } 
            }         
        })
    }
    Delet = (record) => {
        confirm({
            title: '删除操作',
            content: '确定要删除吗?',
            okText: '是',
            okType: 'danger',
            cancelText: '否',  
            onOk:() => {
                this.setDelet(record)
            },
            onCancel:() => {
            },
          });
          this.setState({
            addVisible: false,
            editVisible: false,
           });
    }
    onSelectedChange = (selectedRowKeys, selectedRows) => {
        let selectedRowIds = [];
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
                    this.getDataList({pageNum:1,pageSize:this.state.pageSize,param:""});
                   setTimeout(() => {
                    let success = "删除成功"
                    this.success(success);
                   }, 1000);
                }else{
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                       
                        error = res.data.message
                    }else{
                        error = "删除失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
               }
           })
   }
    componentDidMount(){
        this.getDataList({pageNum:this.state.pageNum,pageSize:this.state.pageSize,param:""});
       
    }
    refresh = () =>{
        this.getDataList({pageNum:1,pageSize:this.state.pageSize,param:""});
    }
    onSearch = (value) =>{
        this.setState({param:value})
        this.getDataList({pageNum:1,pageSize:this.state.pageSize,param:value});
    }
    render(){
        const pagination = {
            current:this.state.pageNum,
            showQuickJumper:true,
            onShowSizeChange:this.onShowSizeChange,
            onChange:this.onChange,
            total:this.state.totalRecord,
            showTotal:this.showTotal,
            // showSizeChanger:true,
            size:"small",
        }
        const { selectedRowKeys } = this.state;
        const rowSelection =  {
            selectedRowKeys,
            onChange: this.onSelectedChange,
        }
        return (
            <div className='data-class-overKnow'>
                <div className = 'eventTitle'>
                    <AuthPower>
                        <AddChild god = "ny-areaAdd" getDataList = {this.getDataList}/>
                    </AuthPower>     
                    <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}><Icon type="reload"/></Button>
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