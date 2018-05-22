import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Popconfirm,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {AddOrderTypeModal,EditOrderTypeModal} from './orderType'



const Search = Input.Search;
// const confirm = Modal.confirm;
const data = [{
    key: '1',
    name: '故障处理',
    code:"gzcl",
    projectname:"中心项目三"
  }, {
    key: '2',
    Name: '现场服务',
    Code:"xcfw",
    projectname:"项目一"
  }];

export default class ChildArea extends Component{
    constructor(props){
        super(props)
        this.state={
           tableData:data,
           addModal:false,
           editModal:false,
           pageSize:10,
           total:50
        }
    }
    columns = [{
        title:"工单名称",
        dataIndex:"name",
        key:"Name"
      },{
        title:"工单缩写",
        dataIndex:"code",
        key:"code"  
      },{
        title:"所属项目",
        dataIndex:"projectname",
        key:"ProjectName"  
      },{
        title:"操作",
        key:"action",
        render:(text,record) => (
            <span>
                <a href="javascript:void(0)" onClick={this.showEditset.bind(this,record)}>编辑</a>
                <span className="ant-divider" />
                <Popconfirm title="确定要删除这条记录吗?" onConfirm={this.deleteOrderType.bind(this,record)} okText="确认" cancelText="取消"><a href="#">删除</a></Popconfirm>
            </span>
        ), 
      }];
    getData=(pageNum,pageSize,keyWord) =>{
        axios.get('http://172.16.6.9:9090/pro/workList',{
            params:{
                pageNum:pageNum,
                pageSize:pageSize,
                mohu:keyWord?keyWord:''
            }
        }).then(res =>{
            this.setState({
                tableData:res.data.page.datas,
                total:res.data.page.tatalRecord
            })
        })
    }
    deleteOrderType=(record) =>{
        axios.put(`http://172.16.6.9:9090/pro/work/worktype/${record.id}`).then(res =>{
            if(res.data.success){
                message.success('删除成功!');
                this.getData(1,this.state.pageSize);
            }else{
                message.error(`删除失败,因为${res.data.message}`)
            }
        })
    }
    componentDidMount(){
        this.getData(1,this.state.pageSize)
    }
    showAddset=() =>{
        this.setState({
            addModal:true
        })
    }
    showEditset=(record) =>{
        this.setState({
            editModal:true,
            editId:record.id,
            editName:record.name,
            editAb:record.code
        })
        sessionStorage.setItem('dsvalue',record.projectid)
    }
    hideAddset=() =>{
        this.setState({
            addModal:false
        })
    }
    hideEditset=() =>{
        this.setState({
            editModal:false
        })
    }
    pageChange=(v) =>{
        this.getData(v,this.state.pageSize)
    }
    handleSearch=(v) =>{
        this.getData(1,this.state.pageSize,v)
    }
    handleFlush=() =>{
        this.getData(1,this.state.pageSize)
    }
    render(){
        const pagination = {
            showQuickJumper:true,
            total:this.state.total,
            onChange:this.pageChange
        }
        return (
            <div className='data-class-over'>
                <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>工单类型管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索" onSearch={this.handleSearch}  style={{ width: 200 }}/>
                        <Button onClick={this.handleFlush}>刷新</Button>
                        <Button type="primary" icon="plus" onClick={this.showAddset}>新建</Button>
                    </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.tableData}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>
                   <AddOrderTypeModal cannel={this.hideAddset} ishow={this.state.addModal} flush={this.getData} />
                   <EditOrderTypeModal cannel={this.hideEditset} ishow={this.state.editModal} flush={this.getData} id={this.state.editId} name={this.state.editName} ab={this.state.editAb} projectid={sessionStorage.getItem('dsvalue')} />
                </div>
            </div>
        )
    }
}