import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,message,Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AuthPower from '../../../authpower';
import AddEventCategory from "./addDictionaryDetail";
// import AddEventCategory from "./test";
import EditEventCategory from "./editDictionaryDetailtest";
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
            // addLoading:false,
            dataList:[],
            record:[],
            pageSize:10,
            pageNum:1,
            totalRecord:0,
            keyWord:''
        }
    }
    columns = [{
        title:"字典类别",
        dataIndex:"typeName",
        key:"typeName"
      },{
        title:"字典项值",
        dataIndex:"itemValue",
        key:"itemValue"
      },{
        title:"操作",
        key:"action",
        render:(text, record) => (
            <span>
                <AuthPower>
                    <a href='javascript:void(0)'  god = "ny-dcDetailEdit" onClick= {this.showModal.bind(this,record)}>编辑</a>
                </AuthPower>
                <span className="ant-divider" />
                <AuthPower>
                    <a href="#"  god = "ny-dcDetailDelet" onClick = {this.Delet.bind(this,record)}>删除</a>
                </AuthPower>
            </span>
        ), 
    }]; 
    showModal = (record) =>{
        this.setState({record,editVisible:true});
    }
    getDataList =({pageNum,pageSize,param}) =>{
        $axios.get(`${config.api_server}/sys/dictitem/query/fuzzy`,{
            params:{
                pageNum:pageNum,
                pageSize:pageSize,
                param:param
            }
        }).then(res =>{
            if(res.data.page.datas){
                this.setState({totalRecord:res.data.page.totalRecord,dataList:res.data.page.datas,pageNum:pageNum})
            }       
        })
    }
    componentDidMount(){
        let pageNum = this.state.pageNum;
        let pageSize = this.state.pageSize;
        this.getDataList({pageNum,pageSize});
    }
    success = success => {
        // success('操作成功!');
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
                $axios.get(`${config.api_server}/sys/dictitem/delete?id=${records}`).then(res =>{
                    //eslint-disable-next-line
                   // console.log(res.data.success);
                    let datas = res.data.success;
                    if(datas){
                        let pageNum = 1;
                        let pageSize = this.state.pageSize;
                        this.getDataList({pageNum,pageSize});
                        // this.getDataList({pageNum:this.state.pageNum,pageSize:this.state.pageSize})
                        setTimeout(() => {
                            let success = "删除成功"
                            this.success(success);
                        }, 3000);
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
    onShowSizeChange = (current, size) =>{
        this.setState({pageNum:current})
        this.getDataList({pageNum:current,pageSize:size})
    } 
    onChange = (page, pageSize) =>{
        this.setState({pageNum:page})
        this.getDataList({pageNum :page,pageSize:pageSize,param:this.state.keyWord})
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    }
    showTotal = (total) => {
        return `共 ${total} 条记录 `
    }
    refresh = () =>{
        let pageNum = 1;
        let pageSize = this.state.pageSize;
        this.setState({keyWord:""})
        this.getDataList({pageNum,pageSize});
    }
    onSearch = (value) =>{
        let pageNum = 1;
        let pageSize = 10;
        let param = value;
        this.setState({
            keyWord:value
        })
      this.getDataList({pageNum,pageSize,param})
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
                    <AddEventCategory god = "ny-dcDetailAdd" getDataList = {this.getDataList}/>
                </AuthPower>
                    <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}><Icon type="reload"/></Button>
                    <div className = "eventTitleSearch"  style={{ width: "20%" }}>
                        <Search placeholder="搜索"  style={{ width: "100%" }} onSearch={this.onSearch}/>                          
                    </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.dataList}  pagination = {pagination} columns={this.columns} />
                    </LocaleProvider>
                </div>                 
                    <EditEventCategory  record={this.state.record} editVisible = {this.state.editVisible} getDataList = {this.getDataList} changeT = {this.changeT}/>
            </div>
        )
    }
}