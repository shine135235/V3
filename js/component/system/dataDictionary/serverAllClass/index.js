import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddServerCategory from "./addServerCategory";
import EditServerCategory from "./editServerCategory";
import './index.less';

const Search = Input.Search;
const confirm = Modal.confirm;
export default class ServerCategory extends Component{
    constructor(props){
        super(props)
        this.state={
            data:[],
            total:0,
            visibleEdit:false,
            rowId:"",
            name:"",
            projectid:"",
        }
    }
    columns = [{
        title:"项目名称",
        dataIndex:"projectname",
        key:"projectname"
    },{
        title:"服务大类",
        dataIndex:"name",
        key:"name"  
    },{
        title:"操作",
        key:"action",
        render:(text,row) => (
            <span>
                <a href="#" onClick={this.showEditServerCategory.bind(this,row.id)}>编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick={this.delRowData.bind(this,row.id)}>删除</a>
            </span>
        ), 
    }];
    delRowData = (rowId) => {
        confirm({
            title: '删除服务大类',
            content: '确定要删除吗？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:this.confirmOK.bind(this,rowId),
            onCancel() {
                
            },
          });
      }
      confirmOK = (rowIds) => {
        this.delSysServerCategoryData(rowIds);
    }
    delSysServerCategoryData = (idString) => {
        $axios.put(`http://172.16.6.9:9090/pro/sla/servicelog/${idString}`).then((json) => {
            if(json.data.success){
                this.success("删除成功");
                this.getListData({});
            }else{
                this.error('删除失败');
            }
        })
      }
      success = (msg) => {
        message.success(msg);
    };
    error = (msg) => {
        message.error(msg);
    };
    showEditServerCategory = (rowId) => {
        //eslint-disable-next-line
        console.log("rowId",rowId);
        $axios.get(`http://172.16.6.9:9090/pro/sla/servicelog?id=${rowId}`).then((json) => {
            //eslint-disable-next-line
            console.log("详情数据",json);
            let rowId = json.data.data.id;
            let name = json.data.data.name;
            let projectid = json.data.data.projectid;
            this.setState({
                rowId,
                name,
                projectid,
            })
        })
        this.setState({
            visibleEdit:true
        });
    }
    getListData = ({pageNum = 1,pageSize = 10,searchVal = ""}) => {
        $axios.get(`http://172.16.6.9:9090/pro/slaList?pageNum=${pageNum}&pageSize=${pageSize}&mohu=${searchVal}`).then((json) => {
            // eslint-disable-next-line
            console.log(json);
            let data = json.data.page.datas;
            let total = json.data.page.tatalRecord;
            // eslint-disable-next-line
            console.log(total);
            this.setState({
                data,
                total,
            })
        })
    }
    componentDidMount(){
        this.getListData({});
    }
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    refreshData = () => {
        this.getListData({});
    }
    changeVisibleVal = ({visibleEdit = false}) => {
        this.setState({visibleEdit});
    }
    searchFunc = (value) => {
        this.getListData({searchVal:value})
    }
    onChange = (page, pageSize) => {
        this.getListData({pageNum:page,pageSize:pageSize});
    }
    onShowSizeChange = (current, size) =>{
        this.getListData({pageNum:current,pageSize:size});
    }
    render(){
        const {visibleEdit,total,rowId,projectid,name} = this.state;
        const pagination = {
            showQuickJumper:true,
            total:total,
            showSizeChanger:true,
            size:"small",
            showTotal:this.showTotal,
            onChange:this.onChange,
            onShowSizeChange:this.onShowSizeChange,
        }
        return (
            <div className='data-class-over'>
                <div className = 'serverCategoryTitle'>
                    <span className="serverCategoryTitleLeft"></span>
                    <span>服务大类管理</span> 
                    <div className = "serverCategoryTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }} onSearch={this.searchFunc}/>
                        <Button onClick={this.refreshData}>刷新</Button>
                        <AddServerCategory getListData={this.getListData} listData={this.state.data}/>
                    </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={this.state.data}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>
                </div>
                <EditServerCategory  listData={this.state.data} getListData={this.getListData} visibleEdit = {visibleEdit} changeVisibleVal = {this.changeVisibleVal} rowId={rowId} name={name} projectid={projectid}/>
            </div>
        )
    }
}