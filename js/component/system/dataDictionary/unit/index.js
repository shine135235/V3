import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,Icon,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AuthPower from '../../../authpower';
import AddUnit from "./unitAdd";
import EditUnit from "./unitEdit";
import config from '../../../../config';
// import './projectAdministration.less';

const Search = Input.Search;
const confirm = Modal.confirm;
export default class ChildArea extends Component{
    constructor(props){
        super(props)
        this.state={
            // editLoading: false,
            // editVisible: false,
            // addVisible:false,
            // addLoading:false,
            // parentID:this.props,
            record:[],
            dataList:[],
            pageSize:10,
            pageNum:1,
            editData:[],
            nameValue:"",
            principalPhone:"",
            principal:"",
            note:"",
            unitType:"",
            address:"",
            recordId:"",
            totalRecord:0,
            selectedRowKeys:[],
            showBetchDel:"none",
            param:""
        }
    }
    columns = [{
        title:"单位名称",
        dataIndex:"unitName",
        key:"unitName"
      },{
        title:"单位类型",
        dataIndex:"itemValue",
        key:"itemValue"
      },{
        title:"负责人",
        dataIndex:"principal",
        key:"principal"
      },{
        title:"联系电话",
        dataIndex:"principalPhone",
        key:"principalPhone"
      },{
        title:"详细地址",
        dataIndex:"address",
        key:"address"
      },{
        title:"操作",
        key:"action",
        render:(text, record) => (
            <span>
                <AuthPower>
                    <a href="#" god = "ny-unitEdit" onClick= {this.showModal.bind(this,record.id)}>编辑</a>
                </AuthPower>
                <span className="ant-divider" />
                <AuthPower>
                    <a href="#" god = "ny-unitDelet" onClick = {this.delData.bind(this,record.id)}>删除</a>
                </AuthPower>
            </span>
        ), 
    }];
    getEditData = (record) =>{
        axios.get(`${config.api_server}/sys/unit/query/id?id=${record}`).then((res) =>{
            //eslint-disable-next-line
            console.log("recordrecordrecordrecord",res)
            if(res.data.data){
                this.setState({
                    record,editVisible:true,
                    nameValue : res.data.data.name,
                    principalPhone : res.data.data.principalPhone,
                    principal : res.data.data.principal,
                    note :res.data.data.note,
                    unitType : res.data.data.unitType,
                    address  : res.data.data.address,
                    recordId : record
                })
                // this.setState({tatalRecord:res.data.page.datas.tatalRecord})
            }
            //eslint-disable-next-line
            // console.log("aboutall",res.data.data)
        })
    }
    success = success => {
        // success('操作成功!');
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    onShowSizeChange = (current, size) =>{
        this.setState({pageNum:current,selectedRowKeys:[],showBetchDel:"none"})
        this.getDataList({pageNum:current,pageSize:size,param:this.state.param})
    } 
    onChange = (page, pageSize) =>{
        this.setState({pageNum:page,selectedRowKeys:[],showBetchDel:"none"})
        this.getDataList({pageNum :page,pageSize:pageSize,param:this.state.param})
    }
    showTotal = (total) => {
        return `共 ${total} 条记录`
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    }
    showModal = (record) =>{
        this.getEditData(record);
    }
    delData = (record,e) => {
        e.stopPropagation();
        confirm({
            title: `删除操作`,
            content:"确定要删除吗?",
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
    }
    setDelet = (pid) =>{       
        let ids = pid.split(",");
       axios({
           url:`${config.api_server}/sys/unit`,
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
                   this.getDataList({pageNum:1,pageSize:10,param:""});    
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
    getDataList = ({pageNum,pageSize,param=""}) =>{
        axios.get(`${config.api_server}/sys/unit/list?pageNum=${pageNum}&pageSize=${pageSize}&param=${param}`).then((res) =>{
            if(res.data.page.datas){
                this.setState({dataList:res.data.page.datas,totalRecord:res.data.page.totalRecord,pageNum:pageNum})
                // this.setState({totalRecord:res.data.page.totalRecord})
            }
        })
      }
    componentDidMount(){
        this.getDataList({pageNum:1,pageSize:10,param:""});
    }
    refresh = () =>{
        this.setState({selectedRowKeys:[],showBetchDel:"none",param:""})
        this.getDataList({pageNum:1,pageSize:10,param:""});
    }  
    onSearch = (value) =>{
        let pageNum = 1;
        let pageSize = 10;
        let param = value;
        this.setState({param:value,selectedRowKeys:[],showBetchDel:"none"})
        this.getDataList({pageNum,pageSize,param});
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
                {/* <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>服务单位</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }}/>
                        <Button onClick = {this.refresh}>刷新</Button>
                        <AddUnit getDataList = { this.getDataList}/>
                    </div>
                </div> */}
                <div className = 'eventTitle'>
                    <AuthPower>
                        <AddUnit god = "ny-unitAdd" getDataList = { this.getDataList}/>
                    </AuthPower>
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}><Icon type="reload"/></Button>
                        <div className = "eventTitleSearch"  style={{ width: "20%" }}>
                            <Search placeholder="搜索"  style={{ width: "100%" }} onSearch={this.onSearch}/>                          
                        </div>
                </div>
                <div className="slaManagement_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                    <Icon type="check-circle" />
                    <span className="slaManagement_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                    <span className='slaManagement_Betch_Delete_btn' onClick={this.delData.bind(this,this.state.delIds)} style = {{"color":"red"}}>批量删除</span>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.dataList}  pagination = {pagination} columns={this.columns} rowSelection = {rowSelection}/>          
                    </LocaleProvider>                   
                </div>
                <EditUnit  
                    getDataList = {this.getDataList} 
                    editVisible = {this.state.editVisible} 
                    nameValue={ this.state.nameValue} 
                    principalPhone={ this.state.principalPhone} 
                    principal={ this.state.principal} 
                    note={ this.state.note} 
                    unitType={ this.state.unitType} 
                    address={ this.state.address} 
                    recordId={ this.state.recordId} 
                    changeT = {this.changeT}
                />
            </div>
        )
    }
}