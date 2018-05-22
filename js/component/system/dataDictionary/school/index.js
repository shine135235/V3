import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddSchool from "./addSchool";
import EditSchool from "./editSchool";

// import './index.less';

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
            nameValue:"",
            principalPhone:"",
            principal:"",
            note:"",
            unitType:"",
            address:"",
            recordId:"",
            area:"",
            tatalRecord:0
        }
    }
    columns = [{
        title:"单位名称",
        dataIndex:"name",
        key:"name"
      },{
        title:"单位类型",
        dataIndex:"itemValue",
        key:"itemValue"
      },{
        title:"所属片区",
        dataIndex:"areaName",
        key:"areaName"
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
                <a href="#">删除</a>
            </span>
        ), 
    }];
    getEditData = (record) =>{
         //eslint-disable-next-line
         console.log("recordrecordrecordrecord",record)
        $axios.get(`http://172.16.6.11:9090/sys/unit/query/userunit/id?id=${record}`).then((res) =>{
            //eslint-disable-next-line
            //console.log("recordrecordrecordrecord",record)
            //eslint-disable-next-line
             console.log("aboutall",res)
            if(res.data.data){
                this.setState({
                    record,
                    editVisible:true,
                    nameValue : res.data.data.name,
                    principalPhone : res.data.data.principalPhone,
                    principal : res.data.data.principal,
                    note :res.data.data.note,
                    unitType : res.data.data.unitType,
                    address  : res.data.data.address,
                    area  : res.data.data.areaId,
                    recordId : record
                })
                // this.setState({tatalRecord:res.data.page.datas.tatalRecord})
            }
            //eslint-disable-next-line
            // console.log("aboutall",res.data.data)
        })
    }
    showModal = (record) =>{
        this.getEditData(record);
    }
    getSchoolDataList =({pageNum=1,pageSize=10}) =>{
        $axios.get(`http://172.16.6.11:9090/sys/unit/userunit/list?pageNum=${pageNum}&pageSize=${pageSize}`).then(res =>{
        //eslint-disable-next-line
        console.log("dataListdataList",res)        
        if(res.data.page.datas){
                    //eslint-disable-next-line
                    console.log("dataListdataList",res.data.page.datas)
                    this.setState({dataList:res.data.page.datas,tatalRecord:res.data.page.datas.tatalRecord})
                }       
        })
    }
    componentDidMount(){
         this.getSchoolDataList({});
    }
    refresh = () =>{
        this.getSchoolDataList({});
    }  
    onShowSizeChange = (current, size) =>{
        this.getSchoolDataList({pageNum:current,pageSize:size})
    } 
    onChange = (page, pageSize) =>{
        this.getSchoolDataList({pageNum :page,pageSize:pageSize})
    }
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
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
                    <span>用户单位 管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }}/>
                        <Button onClick = {this.refresh}>刷新</Button>
                        <AddSchool getSchoolDataList = {this.getSchoolDataList} dataList = {this.state.data} />
                    </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.dataList}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>                   
                </div>

                <EditSchool  
                    getSchoolDataList = {this.getSchoolDataList} 
                    editVisible = {this.state.editVisible} 
                    nameValue={ this.state.nameValue} 
                    principalPhone={ this.state.principalPhone} 
                    principal={ this.state.principal} 
                    note={ this.state.note} 
                    area={ this.state.area} 
                    recordId={ this.state.recordId} 
                    unitType={ this.state.unitType} 
                    address={ this.state.address} 
                    changeT = {this.changeT}
                />
            </div>
        )
    }
}