import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,message,Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AuthPower from '../../../authpower';
import AddEventCategory from "./addDictionaryAll";
import EditDictionaryAll from "./editDictionaryAll";
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
            data:[],
            record:[],
            pageSize:10,
            pageNum:1,
            totalRecord:0
        }
    }
    columns = [{
        title:"类别名称",
        dataIndex:"name",
        key:"name"
      },{
        title:"创建人",
        dataIndex:"createBy",
        key:"createBy"
      },{
        title:"类别码",
        dataIndex:"categoryCode",
        key:"categoryCode"
      },{
        title:"描述",
        dataIndex:"description",
        key:"description"
      },{
        title:"操作",
        key:"action",
        render:(text, record) => (
            <span>
                <AuthPower>
                <a href="#"  god = "ny-dcAllEdit" onClick= {this.showModal.bind(this,record)}>编辑</a>
                </AuthPower>
                <span className="ant-divider" />
                <AuthPower>
                <a href="#" god = "ny-dcAllDelet" onClick = {this.Delet.bind(this,record)}>删除</a>
                </AuthPower>
            </span>
        ), 
    }];
    showModal = (record) =>{
        this.setState({record,editVisible:true});
    }
    getParentListData = ({pageNum,pageSize}) => {
        axios.get(`${config.api_server}/sys/dict/queryall?pageNum=${pageNum}&pageSize=${pageSize}`).then((res) =>{
            if(res.data.page.datas){
                this.setState({data:res.data.page.datas,totalRecord:res.data.page.totalRecord,pageNum:pageNum})
                //eslint-disable-next-line
               // console.log("ssssss",res.data.page);
               // this.setState({totalRecord:res.data.page.totalRecord})
            }
        })
    }

    componentDidMount(){
        let pageNum = this.state.pageNum;
        let pageSize = this.state.pageSize;
        this.getParentListData({pageNum,pageSize});
    }
    refresh = () =>{
        // let pageNum = this.state.pageNum;
        let pageNum = 1;
        let pageSize = this.state.pageSize;
        this.getParentListData({pageNum,pageSize});
    }
    success = (success) => {
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    Delet = (record) => {
        let records = record.id;
        confirm({
            title: '删除操作',
            content: '确定要删除吗？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:() => {
              axios.get(`${config.api_server}/sys/dict/delete?id=${records}`).then(res =>{
                    let datas = res.data.success;
                    if(datas == true){
                        let pageNum = 1;
                        let pageSize = this.state.pageSize;
                        this.getParentListData({pageNum,pageSize});
                        setTimeout(() => {
                            let success = "删除字典类别成功"
                            this.success(success);
                        }, 1000);
                    }else{
                        let error = ""
                        if(res.data.message && res.data.message != ""){
                            error = res.data.message
                        }else{
                            error = "删除字典类别失败"
                        }
                        setTimeout(() => {
                                this.error(error);
                        }, 1000);
                    }
                })
            },
            onCancel:() => {
                 //eslint-disable-next-line
              //console.log('Cancel');
            },
        });
    }
    onShowSizeChange = (current, size) =>{
        this.setState({pageNum:current})
        this.getParentListData({pageNum:current,pageSize:size})
    } 
    onChange = (page, pageSize) =>{
        this.setState({pageNum:page})
        this.getParentListData({pageNum :page,pageSize:pageSize})
    }
    showTotal = (total) => {
        return `共 ${total} 条记录 `
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    }
    onSearch = (value) =>{
        let pageNum = 1;
        let pageSize = 10;
        let searchValue = value;
        axios.get(`${config.api_server}/sys/dict/query/fuzzy?pageNum=${pageNum}&pageSize=${pageSize}&param=${searchValue}`).then((res) =>{
            if(res.data.page.datas){
                this.setState({data:res.data.page.datas})
                this.setState({totalRecord:res.data.page.totalRecord})
            }
        })

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
                        <AddEventCategory god = "ny-dcAllAdd" getParentListData = {this.getParentListData} dataList = {this.state.data}/>
                    </AuthPower>
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}><Icon type="reload"/></Button>
                        <div className = "eventTitleSearch"  style={{ width: "20%" }}>
                            <Search placeholder="搜索"  style={{ width: "100%" }} onSearch={this.onSearch}/>                          
                        </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.data}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>                   
                </div>
                <EditDictionaryAll recordData={this.state.record}  editVisible = {this.state.editVisible} getParentListData = {this.getParentListData } changeT = {this.changeT}/>
            </div>
        )
    }
}