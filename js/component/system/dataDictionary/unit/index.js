import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddUnit from "./unitAdd";
import EditUnit from "./unitEdit";
// import './projectAdministration.less';

const Search = Input.Search;
// const confirm = Modal.confirm;
// const data = [
//     {
//     key: '1',
//     CNAME:"信息教育中心",
//     PNAME:"教育单位",
//     FNAME:"断线",
//     Addr:"朝阳信息中心",
//     Addrs:"朝阳中心附近",
//     pname:"韩梅梅",
//     phone:"18888888888"
//     }
// ];

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
            tatalRecord:0


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
                <a href="#" onClick= {this.showModal.bind(this,record.id)}>编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick = {this.Delet.bind(this,record)}>删除</a>
            </span>
        ), 
    }];
    getEditData = (record) =>{
        axios.get(`http://172.16.6.11:9090/sys/unit/query/id?id=${record}`).then((res) =>{
            //eslint-disable-next-line
            console.log("recordrecordrecordrecord",record)
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
    showModal = (record) =>{
        this.getEditData(record);
    }
    Delet = () =>{
        //eslint-disable-next-line
        // console.log(record);
    }
    getDataList = ({pageNum =1,pageSize= 10 }) =>{
        axios.get(`http://172.16.6.11:9090/sys/unit/list?pageNum=${pageNum}&pageSize=${pageSize}`).then((res) =>{
            if(res.data.page.datas){
                this.setState({dataList:res.data.page.datas})
                this.setState({tatalRecord:res.data.page.datas.tatalRecord})
            }
            //eslint-disable-next-line
            // console.log("aboutall",res.data.page.datas)
        })
      }
    componentDidMount(){
        this.getDataList({});
    }
    refresh = () =>{
        this.getDataList({});
    }   
    render(){
        const pagination = {
            showQuickJumper:true,
            onShowSizeChange:this.onShowSizeChange,
            onChange:this.onChange,
            total:this.state.tatalRecord,
            showTotal:this.showTotal,
            showSizeChanger:true,
            size:"small",
        }
        return (
            <div className='data-class-over'>
                <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>服务单位</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }}/>
                        <Button onClick = {this.refresh}>刷新</Button>
                        <AddUnit getDataList = { this.getDataList}/>
                    </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.dataList}  pagination = {pagination} columns={this.columns} />          
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