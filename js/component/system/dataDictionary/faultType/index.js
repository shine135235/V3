import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,message,Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AuthPower from '../../../authpower';
import AddFaultType from "./addFaultType";
import EditFaultType from "./editFaultType";
import config from '../../../../config';
// import './projectAdministration.less';

const Search = Input.Search;
const confirm = Modal.confirm;
export default class ChildArea extends Component{
    constructor(props){
        super(props)
        this.state={
            editLoading: false,
            editVisible: false,
            addVisible:false,
            addLoading:false,
            pageSize:10,
            pageNum:1,
            totalRecord:0,
            record:{},
            data:[],
            faultname:"",
            faultAllId : "",
            faultDetailId :"",
            faultDetailList:[],
            search:""
        }
    }
    columns = [{
        title:"事件类型名称",
        dataIndex:"typename",
        key:"typename"
      },{
        title:"事件大类名称",
        dataIndex:"faultname",
        key:"faultname"
      },{
        title:"事件细类名称",
        dataIndex:"ffaultname",
        key:"ffaultname"
      },{
        title:"操作",
        key:"action",
        render:(text, record) => (
            <span>
                <AuthPower>
                    <a href="#" god = "ny-faultTypeEdit" onClick= {this.showModal.bind(this,record)} >编辑</a>
                </AuthPower>
                <span className="ant-divider" />
                <AuthPower>
                    <a href="#" god = "ny-faultTypedelet"  onClick= {this.Delet.bind(this,record.id)}>删除</a>
                </AuthPower>
            </span>
        ), 
    }];
    setChildstate  = (value) =>{
        axios.get(`${config.api_server}/sys/faultcategory/sublist?parentId=${value}`).then((res) =>{
            if(res.data.page){
                this.setState({faultDetailList:res.data.page.datas})
            } 
            
        })
    }
    showModal = (record) =>{
        this.setChildstate (record.fid)
        this.setState({record,editVisible:true,faultname:record.typename,faultAllId:record.fid,faultDetailId:record.ffid});  
    }
    getParentListDatas = ({pageNum,pageSize,search}) => {
        axios.get(`${config.api_server}/sys/faulttype/list?pageNum=${pageNum}&pageSize=${pageSize}&search=${search}`).then((res) =>{
            if(res.data.page){
                this.setState({data:res.data.page.datas,totalRecord:res.data.page.totalRecord,pageNum:pageNum})
            }
        })
    }
    componentDidMount(){
        // let pageNum = this.state.pageNum;
        // let pageSize = this.state.pageSize;
        this.getParentListDatas({pageNum:this.state.pageNum,pageSize:this.state.pageSize,search:""});
    }
    success = (success) => {
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    Delet = (record) => {
        confirm({
            title: '删除操作',
            content: '确定要删除吗？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:() => {
                this.setDelet(record)
            },
            onCancel:() => {
                 //eslint-disable-next-line
              console.log('Cancel');
            },
          });
    } 
    setDelet = (record) =>{
        let ids = record.split(",");
        axios({
            url:`${config.api_server}/sys/faulttype`,
            method:'delete',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            data:{
                "id":ids
            }
        }).then((res) => {
            let datas = res.data.success;
            if(datas){
                // let pageNum = 1;
                // let pageSize = this.state.pageSize;
                this.getParentListDatas({pageNum:1,pageSize:this.state.pageSize,search:""});
                setTimeout(() => {
                    this.setState({ editLoading: false, editVisible: false});
                }, 1000);
                setTimeout(() => {
                    let success = "删除事件类型成功"
                    this.success(success);
                }, 1000);
            }else{
                this.setState({ editLoading: false});
                let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                        error = "删除事件类型失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
            }
        })
    }
    onShowSizeChange = (current, size) =>{
        this.getParentListDatas({pageNum:current,pageSize:size,search:this.state.search})
    } 
    onChange = (page, pageSize) =>{
        this.getParentListDatas({pageNum :page,pageSize:pageSize,search:this.state.search})
    }
    showTotal = (total) => {
        return `共 ${total} 条记录`
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    } 
    refresh = () =>{
        this.setState({search:""})
        this.getParentListDatas({pageNum :1,pageSize:this.state.pageSize,search:""});
    }
    onSearch = (value) =>{
        // let pageNum = 1;
        // let pageSize = 10;
        // let search = value;
        this.setState({search:value})
        this.getParentListDatas({pageNum:1,pageSize:10,search:value});
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
        return (
            <div className='data-class-overKnow'>
                <div className = 'eventTitle'>
                    <AuthPower>
                        <AddFaultType god = "ny-faultTypeAdd"  getParentListDatas = {this.getParentListDatas}/> 
                    </AuthPower>      
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}><Icon type="reload"/></Button>
                        <div className = "eventTitleSearch"  style={{ width: "20%" }}>
                            <Search placeholder="搜索"  style={{ width: "100%" }} onSearch={this.onSearch}/>                          
                        </div>
                </div>
                <div style = {{"height":"94%","overflowY":"auto"}}>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.data}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>                   
                </div>
                <EditFaultType 
                    editVisible = {this.state.editVisible} 
                    changeT = {this.changeT}
                    record={ this.state.record}
                    faultname={ this.state.faultname}
                    faultAllId={ this.state.faultAllId}
                    faultDetailId={ this.state.faultDetailId}
                    faultDetailList={ this.state.faultDetailList}
                    setChildstate = {this.setChildstate}
                    getParentListDatas = {this.getParentListDatas}
                    
                />
            </div>
        )
    }
}