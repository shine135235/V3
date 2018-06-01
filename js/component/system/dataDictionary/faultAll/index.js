import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
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
        }
    }
    columns = [{
        title:"故障大类名称",
        dataIndex:"faultname",
        key:"faultname"
      },{
        title:"关联项目",
        dataIndex:"projectname",
        key:"projectname"
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
        render:(text, record) => (
            <span>
                <a href="#" onClick= {this.showModal.bind(this,record)} >编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick = {this.delData.bind(this,record.id)} >删除</a>
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
    getParentListData = ({pageNum=1,pageSize=10,search = ""}) => {
        axios.get(`${config.api_server}/sys/faultcategory/list?pageNum=${pageNum}&pageSize=${pageSize}&search=${search}`).then((res) =>{
            if(res.data.page){
                this.setState({data:res.data.page.datas})
                      //eslint-disable-next-line
             console.log("rowrowrowrowrowrowrowrow",res.data.page)
                this.setState({totalRecord:res.data.page.totalRecord})
            }
        })
    }
    componentDidMount(){
        this.getParentListData({});
    }
    success = () => {
        // success('操作成功!');
        // const modal = Modal.success({
        //     title: '操作成功',
        //     content: '删除成功',
        //   });
        //   setTimeout(() => modal.destroy(), 2000);
        message.success("添加字典类别管理成功")
    };
    error = () => {
        // Modal.error({
        //   title: '操作失败',
        //   content: '删除失败',
        // });
        message.error("添加字典类别管理成功")
    }
    delData = (record) => {
        confirm({
            title: "删除操作",
            content: "确定要删除选中信息吗?",
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:() => {
                this.setDelet(record)
            //   axios({
            //     url:"http://172.16.6.5:9090/sys/faultcategory",
            //     method:'delete',
            //     headers: {
            //         'Content-type': 'application/json;charset=UTF-8'
            //     },
            //     data:{
            //         "id":record
            //     }
            //     }).then((res) => {
            //         let datas = res.data.success;
            //         if(datas){
            //             this.getParentListData({});
            //             setTimeout(() => {
            //                 this.setState({ addLoading: false, addVisible: false});
            //             }, 1000);
            //             setTimeout(() => {
            //                 this.success();
            //             }, 1000);
            //         }else{
            //             this.setState({ addLoading: false});
            //             setTimeout(() => {
            //                 this.error();
            //             }, 1000);
            //         }
            //     })
            },
            onCancel:() => {
                 //eslint-disable-next-line
            //   console.log('Cancel');
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
        return (
            <div className='data-class-overKnow'>
                {/* <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>故障大类管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }} onSearch={this.onSearch}/>
                        <Button onClick = {this.refresh} >刷新</Button>
                        <AddFault  getParentListData = {this.getParentListData}/>
                    </div>
                </div> */}
                <div className = 'eventTitle'>
                        <AddFault  getParentListData = {this.getParentListData}/>
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}>刷新</Button>
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
                        <Table dataSource={this.state.data}  pagination = {pagination} columns={this.columns} rowSelection = {rowSelection}/>          
                    </LocaleProvider>
                    <EditFaultAll editVisible = {this.state.editVisible} getParentListData = {this.getParentListData } record={ this.state.record} initialSlect = {this.state.initialSlect}  changeT = {this.changeT} name = {this.state.name}/>
                    <Project />
                </div>
            </div>
        )
    }
}