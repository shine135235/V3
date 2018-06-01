import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddFaultDetail from "./addFaultDetail";
import EditFaultDetail from "./editFaultDetail";
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
            tatalRecord:0,
            record:{},
            data:[]
        }
    }
    columns = [{
        title:"故障细类名称",
        dataIndex:"faultname",
        key:"faultname"
      },{
        title:"故障大类名称",
        dataIndex:"fname",
        key:"fname"
      },{
        title:"操作",
        key:"action",
        render:(text, record) => (
            <span>
                <a href="#" onClick= {this.showModal.bind(this,record)}>编辑</a>
                <span className="ant-divider" />
                <a href="#"  onClick= {this.Delet.bind(this,record)}>删除</a>
            </span>
        ), 
    }];
    showModal = (record) =>{
        this.setState({record,editVisible:true});
    }
    getParentListData = ({pageNum=1,pageSize=10,search = ""}) => {
        axios.get(`${config.api_server}/sys/faultcategory/sublist?pageNum=${pageNum}&pageSize=${pageSize}&search=${search}`).then((res) =>{
            if(res.data.page){
                this.setState({data:res.data.page.datas})
                this.setState({tatalRecord:res.data.page.totalRecord})
            }
        })
    }
    componentDidMount(){
        this.getParentListData({});
    }
    Delet = (record) => {
        //eslint-disable-next-line
        console.log(record);
        confirm({
            title: '确定要删除此条信息吗?',
            content: '删除的内容？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:() => {
                axios({
                    url:`${config.api_server}/sys/faultcategory`,
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
            onCancel:() => {
                 //eslint-disable-next-line
              console.log('Cancel');
            },
          });
    }  
    onShowSizeChange = (current, size) =>{
        this.getParentListDatas({pageNum:current,pageSize:size})
    } 
    onChange = (page, pageSize) =>{
        this.getParentListDatas({pageNum :page,pageSize:pageSize})
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
    onSearch = (value) =>{
        let pageNum = 1;
        let pageSize = 10;
        let search = value;
        this.getParentListData({pageNum,pageSize,search});
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
            <div className='data-class-overKnow'>
                {/* <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>故障细类管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }} onSearch={this.onSearch} />
                        <Button onClick = {this.refresh}>刷新</Button>
                        <AddFaultDetail getParentListData = {this.getParentListData} />
                    </div>
                </div> */}
                <div className = 'eventTitle'>
                        <AddFaultDetail getParentListData = {this.getParentListData} /> 
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}>刷新</Button>
                        <div className = "eventTitleSearch"  style={{ width: "20%" }}>
                            <Search placeholder="搜索"  style={{ width: "100%" }} onSearch={this.onSearch}/>                          
                        </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.data}  pagination = {pagination} columns={this.columns} />        
                    </LocaleProvider>                   
                </div>
                <EditFaultDetail 
                    editVisible = {this.state.editVisible} 
                    changeT = {this.changeT}
                    getParentListDatas = {this.getParentListDatas }
                     record={ this.state.record}
                />
            </div>
        )
    }
}