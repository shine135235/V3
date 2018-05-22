import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddChild from "./addChild";
import EditChild from "./editChild";
import './childArea.less';

const Search = Input.Search;
const confirm = Modal.confirm;
// const data = [{
//     key: '1',
//     childAreaName: '中心附近',
//     childAreaCode:"zxfj",
//     childAreaDesc:"顺义",
//     parentAreaName:"朝阳"
//   }, {
//     key: '2',
//     childAreaName: '苏家坨镇',
//     childAreaCode:"zdxx",
//     childAreaDesc:"苏家坨镇",
//     parentAreaName:"海淀"
//   }, { 
//     key: '3',
//     childAreaName: '幼儿园',
//     childAreaCode:"yey",
//     childAreaDesc:"幼儿园",
//     parentAreaName:"朝阳"
//   }, {
//     key: '4',
//     childAreaName: '机关科室',
//     childAreaCode:"zgkss",
//     childAreaDesc:"机关科室",
//     parentAreaName:"朝阳"
//   }];

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
            // addLoading:false,
            // parentID:this.props,
            dataList:[]
        }
    }
    columns = [{
        title:"片区名称",
        dataIndex:"areaName",
        key:"areaName"
      },{
        title:"代号",
        dataIndex:"areaCode",
        key:"areaCode"  
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
                <a href="#" onClick = {this.Delet.bind(this,record.areaId)}>删除</a>
            </span>
        ), 
    }];
    showModal = (record) =>{
        this.setState({record,editVisible:true});
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
    getDataList =({pageNum=1,pageSize=10}) =>{
        $axios.get(`http://172.16.6.11:9090/sys/area/list?pageNum=${pageNum}&pageSize=${pageSize}`).then(res =>{
            //eslint-disable-next-line
            console.log('ssssssssssssss',res)
                if(res.data.page.datas){
                    this.setState({dataList:res.data.page.datas})
                    this.setState({tatalRecord:res.data.page.datas.areaId})
                }       
        })
    }
    Delet = (record) => {
        //eslint-disable-next-line
         console.log("ssssss",record);
        //  let records = record.id;
        confirm({
            title: '确定要删除此条信息吗?',
            content: '删除的内容？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',  
            onOk:() => {
                $axios.get(`http://172.16.6.11:9090/sys/area/delete?id=${record}`).then(res =>{
                    //eslint-disable-next-line
                    console.log(res.data.success);
                    let datas = res.data.success;
                    if(datas){
                        this.getDataList({});
                            setTimeout(() => {
                                this.success();
                            }, 3000);
                    }else{
                        setTimeout(() => {
                            this.error();
                        }, 3000);
                    }
                })
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
    componentDidMount(){
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
                    <span>片区管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }}/>
                        <Button >刷新</Button>
                        <AddChild getDataList = {this.getDataList}/>
                    </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.dataList}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>                    
                    <EditChild  record={this.state.record} editVisible = {this.state.editVisible} getDataList = {this.getDataList} changeT = {this.changeT}/>
                   
                </div>
            </div>
        )
    }
}