import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,message,Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddKnowledge from "./addKnowledge";
import DetailKnowledge from "./detailKnowledge";
import EditKnowledge from "./editKnowledge";
import AuditKnowledge from "./auditKnowledge";
import config from '../../../config'
// import Project from "./projectAction";
import './index.less';

// let _this;
const Search = Input.Search;
const confirm = Modal.confirm;
export default class ChildArea extends Component{
    constructor(props){
        super(props)
        // _this = this;
        this.state={
            pageSize:10,
            pageNum:1,
            totalRecord:0,
            record:{},
            data:[],
            detailData:{},
            editData:{},
            name:"",
            initialSlect:[],
            selectedRowKeys:[],
            showType:"list",
            showBetchDel:"none"

        }
    }
    columns = [{
        title:"主题",
        dataIndex:"theme",
        key:"theme"
      },{
        title:"提交人",
        dataIndex:"createBy",
        key:"createBy"
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
        title:"知识库类型",
        dataIndex:"knowledgeTypeName",
        key:"knowledgeTypeName"
      },{
        title:"点击次数",
        dataIndex:"clickNumber",
        key:"clickNumber"
      },{
        title:"时间",
        dataIndex:"createTime",
        key:"createTime"
      },{
        title:"状态",
        dataIndex:"statusName",
        key:"statusName"
      },{
        title:"操作",
        key:"action",
        // render:(text, record) => (
        //     <span>
        //         <a href="#" onClick= {this.showModal.bind(this,record)} >编辑</a>
        //         <span className="ant-divider" />
        //         <a href="#" onClick = {this.Delet.bind(this,record)} >删除</a>
        //         <span className="ant-divider" />
        //         <a href="#"  >项目设置</a>
        //     </span>
        // ),
        render: (text,row) => {
            let a = []
            if(row.statusCode == "0"){
                a.push(
                    <a href="javascript:void 0" key="1" onClick={this.showAudit.bind(this,row)}>审核</a>
                )
                a.push(
                    <span className="ant-divider"  key="2"/>
                )
            }else if(row.statusCode == "1"){
                a.push(
                    <a href="javascript:void 0" key="1" onClick={this.showEdit.bind(this,row)}>编辑</a>
                )
                a.push(
                    <span className="ant-divider" key="2"/>
                )
            }
            return(
                <span>
                    {a}
                    <a href="javascript:void 0" onClick={this.delData.bind(this,row.id)}>删除</a>
                </span>
            )
        } 
    }];
    getParentListData = ({pageNum=1,pageSize=10,search = ""}) => {
        axios.get(`${config.api_server}/ops/knowledge?pageNum=${pageNum}&pageSize=${pageSize}&search=${search}`).then((res) =>{
            //eslint-disable-next-line
            // console.log("rowrowrowrowrowrowrowrow",res.data.page)
            if(res.data.page){
                this.setState({data:res.data.page.datas})
                      
                this.setState({totalRecord:res.data.page.totalRecord})
            }
        })
    }
    componentDidMount(){
         this.getParentListData({});
    }
    success = (success) => {
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    oneDelData = (record,e) =>{
        e.stopPropagation();
    }
    delData = (record,e) => {
        e.stopPropagation();
         //eslint-disable-next-line
           // console.log("iiiiiiiiiiiiii",record)
        confirm({
            title: `删除操作`,
            content:"确定要删除选中信息吗?",
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
         // eslint-disable-next-line
         //console.log(pid);
         let ids = pid.split(",");
        axios({
            url:`${config.api_server}/ops/knowledge`,
            method:'delete',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            data:{
                "knowledgeIds":ids
            }
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.setState({selectedRowKeys:[],showBetchDel:"none"})
                    this.getParentListData({});
                    
                    setTimeout(() => {
                        let success = "批量删除成功"
                        this.success(success);
                    }, 1000);
                }else{
                    setTimeout(() => {
                        let error = "批量删除失败"
                        this.error(error);
                    }, 1000);
                }
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
    refresh = () =>{
        this.getParentListData({});
    }
    onSearch = (value) =>{
        let pageNum = 1;
        let pageSize = 10;
        let search = value;
        this.getParentListData({pageNum,pageSize,search});
    }
    changeShowType = ({showType = "list"}) => {
        this.setState({showType});
    }
    checkDetail = (record) => {
        return{
            onClick:this.checkDetailRealy.bind(this,record)
        }
    }
    //详情
    checkDetailRealy = (record,e) => {
        e.stopPropagation();
        let recordId = record.id
        this.getDetail({recordId,checkType:"detail"})
    }
    //编辑
    showEdit = (record,e) => {
        e.stopPropagation();
         let recordId = record.id
         this.getDetail({recordId,checkType:"edit"})
        
    }
    //审核
    showAudit = (record,e) => {
        e.stopPropagation();
         let recordId = record.id
         this.getDetail({recordId,checkType:"audit"})
        
    }
    showModal = (record) =>{
        let initialSlect = record.projectids.split(",") ;
        let name = record.faultname;
        this.setState({record,initialSlect,name,editVisible:true});
    }
    getDetail = ({recordId="",checkType = ""}) =>{
        axios.get(`http://172.16.6.5:9090/ops/knowledge/details?id=${recordId}`).then((res) =>{
                let id = res.data.id;
                let knowledgeTypeName = res.data.knowledgeTypeName;
                let knowledgeType = res.data.knowledgeType;
                let theme = res.data.theme;
                let textContent = res.data.textContent;
                let statusCode = res.data.statusCode;
                let descript = ""
                //eslint-disable-next-line
              //console.log('mmmmmmmmmmmmmmmmmmmm',res.data);
                if(res.data.descript == ""){
                     descript = "暂无";
                }else{
                    descript = res.data.descript
                }
                let detailData = {
                    id,
                    knowledgeTypeName,
                    knowledgeType,
                    theme,
                    textContent,
                    statusCode,
                    descript
                }
            if(checkType == "detail"){
                this.setState({detailData,showType:"detail"})
            }else if(checkType == "edit"){
                this.setState({detailData,showType:"edit"})
            }else if(checkType == "audit"){
                this.setState({detailData,showType:"audit"})
            }
        })
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
      allAudit = (record,e) =>{
        e.stopPropagation();
        let ids = record.split(",");
        //console.log("recordrecord",record);
        let bValue = {};
        bValue.code = "3";
        bValue.desc = "";
        bValue.knowledgeIds = ids;
        //eslint-disable-next-line
        //console.log("bValuebValuebValuebValue",bValue)
        axios({
            url:"http://172.16.6.5:9090/ops/knowledge/review",
            method:'post',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            data:bValue
            }).then((res) => {
                //eslint-disable-next-line
            //  console.log("rowrowrowrowrowrowrowrow",res.data)
                let datas = res.data.success;
                if(datas){
                    // _this.getParentListData({})
                    this.setState({selectedRowKeys:[],showBetchDel:"none"})
                    this.getParentListData({});
                    
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    setTimeout(() => {
                        this.error();
                    }, 3000);
                }
            })
      }
    render(){
        const pagination = {
            showQuickJumper:true,
            onShowSizeChange:this.onShowSizeChange,
            onChange:this.onChange,
            total:this.state.totalRecord,
            showTotal:this.showTotal,
            showSizeChanger:true,
            size:"small",
        }
        const { selectedRowKeys } = this.state;
        const rowSelection =  {
            selectedRowKeys,
            onChange: this.onSelectedChange,
        }

        if(this.state.showType == "list"){
            return (
                <div className='data-class-overKnow'>
                    <div className = 'eventTitle'>
                        <Button type="primary"  onClick={this.changeShowType.bind(this,{showType:"add"})} icon="plus" style = {{"marginRight":"20px"}}>新建</Button>
                        <Button onClick = {this.refresh} >刷新</Button>
                        <div className = "eventTitleSearch" style={{ width: "20%" }}>
                            <Search placeholder="搜索"  style={{ width: "100%" }} onSearch={this.onSearch}/>                          
                        </div>
                    </div>
                    <div className="slaManagement_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                        <Icon type="check-circle" />
                        <span className="slaManagement_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                        <span className='slaManagement_Betch_Delete_btn' onClick={this.allAudit.bind(this,this.state.delIds)}>批量审核</span>
                        <span className='slaManagement_Betch_Delete_btn' onClick={this.delData.bind(this,this.state.delIds)} style = {{"color":"red"}}>批量删除</span>
                    </div>
                    <div>
                        <LocaleProvider locale = {zhCN}>
                            <Table 
                                dataSource={this.state.data} 
                                rowSelection = {rowSelection} 
                                pagination = {pagination} 
                                columns={this.columns} 
                                onRow={this.checkDetail.bind(this)}
                            />          
                        </LocaleProvider>
                        {/* <EditFaultAll editVisible = {this.state.editVisible} getParentListData = {this.getParentListData } record={ this.state.record} initialSlect = {this.state.initialSlect}  changeT = {this.changeT} name = {this.state.name}/> */}
                        {/* <Project /> */}
                    </div>
                </div>
            )
        }else if(this.state.showType == "add"){
            return(
                <AddKnowledge  changeShowType = {this.changeShowType} getParentListData = {this.getParentListData}/>
            )
        }else if(this.state.showType == "detail"){
            return(
                <DetailKnowledge  changeShowType = {this.changeShowType}  detailData = {this.state.detailData}/>
            )
        }else if(this.state.showType == "edit"){
            return(
                <EditKnowledge  changeShowType = {this.changeShowType} getParentListData = {this.getParentListData} detailData = {this.state.detailData}/>
            )
        }else if(this.state.showType == "audit"){
            return(
                <AuditKnowledge  changeShowType = {this.changeShowType} getParentListData = {this.getParentListData} detailData = {this.state.detailData}/>
            )
        }
        
    }
}