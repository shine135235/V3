import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddFaultType from "./addFaultType";
import EditFaultType from "./editFaultType";
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
            record:{},
            data:[],
            faultname:"",
            faultAllId : "",
            faultDetailId :"",
            faultDetailList:[]

        }
    }
    columns = [{
        title:"故障类型名称",
        dataIndex:"typename",
        key:"typename"
      },{
        title:"故障大类名称",
        dataIndex:"faultname",
        key:"faultname"
      },{
        title:"故障细类名称",
        dataIndex:"ffaultname",
        key:"ffaultname"
      },{
        title:"操作",
        key:"action",
        render:(text, record) => (
            <span>
                <a href="#" onClick= {this.showModal.bind(this,record)} >编辑</a>
                <span className="ant-divider" />
                <a href="#"  onClick= {this.Delet.bind(this,record)}>删除</a>
            </span>
        ), 
    }];
    setChildstate  = (value) =>{
        axios.get(`http://172.16.6.5:9090/sys/faultcategory/sublist?parentId=${value}`).then((res) =>{
            if(res.data.page){
                this.setState({faultDetailList:res.data.page.datas})
            } 
            
        })
    }
    showModal = (record) =>{
        //eslint-disable-next-line
        // console.log('recordrecordrecordrecord',record);
        // axios.get(`http://172.16.6.5:9090/sys/faultcategory/sublist?parentId=${record.fid}`).then((res) =>{
        //     //eslint-disable-next-line
        //     console.log("state细类下拉列表",res.data.page.datas)
        //     if(res.data.page){
        //         this.setState({faultDetailList:res.data.page.datas})
        //     }  
        // })
        this.setChildstate (record.fid)
        this.setState({record,editVisible:true,faultname:record.typename,faultAllId:record.fid,faultDetailId:record.ffid});  
    }
    getParentListData = ({pageNum=1,pageSize=10,search = ""}) => {
        axios.get(`http://172.16.6.5:9090/sys/faulttype/list?pageNum=${pageNum}&pageSize=${pageSize}&search=${search}`).then((res) =>{
            if(res.data.page){
                this.setState({data:res.data.page.datas})
                this.setState({tatalRecord:res.data.page.tatalRecord})
            }
        })
    }
    componentDidMount(){
        this.getParentListData({})
    }
    Delet = (record) => {
        confirm({
            title: '确定要删除此条信息吗?',
            content: '删除的内容？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                axios({
                    url:"http://172.16.6.5:9090/sys/faulttype",
                    method:'delete',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    },
                    data:{
                        "id":record.id
                    }
                }).then((res) => {
                    let datas = res.data.success;
                    if(datas){
                        this.getParentListData({});
                        setTimeout(() => {
                            this.setState({ editLoading: false, editVisible: false});
                        }, 1000);
                        setTimeout(() => {
                            this.success();
                        }, 1000);
                    }else{
                        this.setState({ editLoading: false});
                        setTimeout(() => {
                            this.error();
                        }, 1000);
                    }
                })
            },
            onCancel() {
            },
        });
    }
    onShowSizeChange = (current, size) =>{
        this.getParentListData({pageNum:current,pageSize:size})
    } 
    onChange = (page, pageSize) =>{
        this.getParentListData({pageNum :page,pageSize:pageSize})
    }
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    } 
    refresh = () =>{
        this.getParentListDatas({});
    }
    render(){
        const pagination = {
            showQuickJumper:true,
            total:50,
            showSizeChanger:true,
            size:"small",
        }
        return (
            <div className='data-class-over'>
                <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>故障类型管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }} onSearch={this.onSearch} />
                        <Button onClick = {this.refresh}>刷新</Button>
                        <AddFaultType  getParentListData = {this.getParentListData}/>
                    </div>
                </div>
                <div>
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
                    getParentListData = {this.getParentListData}
                    
                />
            </div>
        )
    }
}