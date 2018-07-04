import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,message,Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AuthPower from '../../../authpower';
import AddFault from "./addFaultAll";
import EditFaultAll from "./editFaultAll";
import Project from "./projectAction";
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
            name:"",
            initialSlect:[],
            showBetchDel:"none",
            selectedRowKeys:[],
            search:""
        }
    }
    columns = [{
        title:"事件大类名称",
        dataIndex:"faultname",
        key:"faultname",
        width:200
      },{
        title:"关联项目",
        dataIndex:"projectname",
        key:"projectname",
        // render:(text,row) => {
        //     let rowText = [];
        //     let project = row.projects;
        //     //eslint-disable-next-line
        //     console.log("rowrowrowrowrowrowrowrow",row)
        //     if(project){
        //         for(let i = 0;i<project.length;i++){
        //             rowText.push(project[i].projectname);
        //         }
        //         return(
        //             <span>{rowText.join(",")}</span>
        //         )
        //     }  
        // }
      },{
        title:"操作",
        key:"action",
        width:150,
        render:(text, record) => (
            <span>
                <AuthPower>
                    <a href="#" god = "ny-faultAllEdit" onClick= {this.showModal.bind(this,record)} >编辑</a>
                </AuthPower>
                <span className="ant-divider" />
                <AuthPower>
                    <a href="#" god = "ny-faultAllDelet" onClick = {this.delData.bind(this,record.id)} >删除</a>
                </AuthPower>
                {/* <span className="ant-divider" />
                <a href="#" onClick = {this.Paction.bind(this,record)} >项目设置</a> */}
            </span>
        ), 
    }];
    showModal = (record) =>{
        let initialSlect = record.projectids.split(",") ;
        let name = record.faultname;
        this.setState({record,initialSlect,name,editVisible:true});
    }
    getParentListData = ({pageNum,pageSize,search}) => {
        axios.get(`${config.api_server}/sys/faultcategory/list?pageNum=${pageNum}&pageSize=${pageSize}&search=${search}`).then((res) =>{
            if(res.data.page){
                this.setState({data:res.data.page.datas,totalRecord:res.data.page.totalRecord,pageNum:pageNum})
                      //eslint-disable-next-line
                //this.setState({totalRecord:res.data.page.totalRecord})
            }
        })
    }
    componentDidMount(){
        let pageNum = this.state.pageNum;
        let pageSize = this.state.pageSize;
        this.getParentListData({pageNum,pageSize,search:""});
    }
    success = (success) => {
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    // delData = (record) => {
    //     let childs = "";
    //     axios({
    //         url:`${config.api_server}/sys/faultcategory/sublist`,
    //         method:'get',
    //         headers: {
    //             'Content-type': 'application/json;charset=UTF-8'
    //         },
    //         data:{
    //             "parentId":record
    //         }
    //     }).then((res) => {
    //         console.log("aaaaaaaaaaaaaa",res.data.page.datas.length)
    //             if(res.data.page.datas.length > 0){
    //             childs = "该大类存在子类信息，确定要删除吗?"
    //             }else{
    //             childs = "确定要删除吗?" 
    //             }
    //             confirm({
    //             title: "删除操作",
    //             content: childs,
    //             okText: '是',
    //             okType: 'danger',
    //             cancelText: '否',
    //             onOk:() => {
    //                     this.setDelet(record)
    //             },
    //             onCancel:() => {
    //             },
    //         });
    //     })  
    // }
    delData = (record) => {
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
    setDelet = (pid) =>{
        let ids = pid.split(",");
        axios({
           url:`${config.api_server}/sys/faultcategory`,
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
                    // this.setState({selectedRowKeys:[],showBetchDel:"none"})
                    let pageNum = 1;
                    let pageSize = this.state.pageSize;
                    this.getParentListData({pageNum,pageSize,search:""});
                    setTimeout(() => {
                        let success = "删除事件大类成功"
                        this.success(success);
                    }, 1000);
               }else{
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                        error = "删除事件大类失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
               }
           })
   }
    onShowSizeChange = (current, size) =>{
        //this.setState({pageNum:current})
        this.getParentListData({pageNum:current,pageSize:size,search:this.state.search})
    } 
    onChange = (page, pageSize) =>{
        //this.setState({pageNum:page})
        this.getParentListData({pageNum :page,pageSize:pageSize,search:this.state.search})
    }
    showTotal = (total) => {
        return `共 ${total} 条记录`
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    }  
    refresh = () =>{
        this.getParentListData({pageNum :1,pageSize:this.state.pageSize,search:""});
    }
    onSearch = (value) =>{
        let pageNum = 1;
        let pageSize = 10;
        let search = value;
        this.setState({search:value})
        this.getParentListData({pageNum,pageSize,search});
    }
    onSelectedChange = (selectedRowKeys, selectedRows) => {
        let selectedRowIds = [];
        //eslint-disable-next-line
        //console.log('selectedRowKeysselectedRowKeys',selectedRowKeys);
        //eslint-disable-next-line
        //console.log('selectedRowsselectedRows',selectedRows);
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
        // const { selectedRowKeys } = this.state;
        // const rowSelection =  {
        //     selectedRowKeys,
        //     onChange: this.onSelectedChange,
        // }
        return (
            <div className='data-class-overKnow'>
                <div className = 'eventTitle'>
                    <AuthPower>
                        <AddFault god = "ny-faultAllAdd" getParentListData = {this.getParentListData}/>
                    </AuthPower>
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}><Icon type="reload"/></Button>
                        <div className = "eventTitleSearch"  style={{ width: "20%" }}>
                            <Search placeholder="搜索"  style={{ width: "100%" }} onSearch={this.onSearch}/>                          
                        </div>
                </div>
                {/* <div className="slaManagement_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                        <Icon type="check-circle" />
                        <span className="slaManagement_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                        <span className='slaManagement_Betch_Delete_btn' onClick={this.delData.bind(this,this.state.delIds)} style = {{"color":"red"}}>批量删除</span>
                </div> */}
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.data}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>
                    <EditFaultAll editVisible = {this.state.editVisible} getParentListData = {this.getParentListData } record={ this.state.record} initialSlect = {this.state.initialSlect}  changeT = {this.changeT} name = {this.state.name}/>
                    <Project />
                </div>
            </div>
        )
    }
}