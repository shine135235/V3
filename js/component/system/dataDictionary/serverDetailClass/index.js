import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddServerDetail from './addServerDetail';
import EditServerDetail from './editServerDetail';
import './index.less';

const Search = Input.Search;
const confirm = Modal.confirm;
export default class ChildArea extends Component{
    constructor(props){
        super(props)
        this.state={
            visibleEdit:false,
            row:{},
            data:[],
            total:0,
            rowId:"",
            logid:"",
            name:"",
        }
    }
    columns = [{
        title:"服务大类",
        dataIndex:"logname",
        key:"logname"
      },{
        title:"服务细类",
        dataIndex:"name",
        key:"name"  
      },{
        title:"操作",
        key:"action",
        render:(text,row) => (
            <span>
                <a href="#" onClick={this.showEditServerDetail.bind(this,row.id)}>编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick = {this.delServerDetailData.bind(this,row.id)}>删除</a>
            </span>
        ), 
      }];
      delServerDetailData = (rowId) => {
        confirm({
            title: '删除服务细类',
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
        this.delSysServerDetailData(rowIds);
    }
    delSysServerDetailData = (idString) => {
        $axios.put(`http://172.16.6.9:9090/pro/sla/item/${idString}`).then((json) => {
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
      showEditServerDetail = (rowId) => {
        $axios.get(`http://172.16.6.9:9090/pro/sla/item?id=${rowId}`).then(json => {
            // eslint-disable-next-line
            console.log("详情数据",json);
            let rowId = json.data.data.id;
            let logid = json.data.data.logid;
            let name = json.data.data.name;
            this.setState({
                rowId,
                logid,
                name,
                visibleEdit:true,
            })
        })
        //   this.setState({
        //       row,
        //       visibleEdit:true,
        //   })
      }
    componentDidMount(){
        this.getListData({})
    }
    getListData = ({pageNum=1,pageSize=10,searchVal = ""}) => {
        $axios.get(`http://172.16.6.9:9090/pro/sla/itemList?pageNum=${pageNum}&pageSize=${pageSize}&mohu=${searchVal}`).then((json) => {
            // eslint-disable-next-line
            console.log("细类数据",json);
            let data = json.data.page.datas;
            let total = json.data.page.tatalRecord;
            this.setState({
                data,
                total,
            })
        })
    }
    changeVisibleType = ({visibleEdit = false}) => {
        this.setState({
            visibleEdit,
        })
    }
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
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
    refreshData = () => {
        this.getListData({})
    }
    render(){
        const {visibleEdit,data,total,logid,name,rowId} = this.state;
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
                <div className = 'serverDetailTitle'>
                    <span className="serverDetailTitleLeft"></span>
                    <span>服务细类管理</span> 
                    <div className = "serverDetailTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }} onSearch = {this.searchFunc}/>
                        <Button onClick={this.refreshData}>刷新</Button>
                        <AddServerDetail getListData = {this.getListData} listData = {data}/>
                    </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={data}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>
                </div>
                <EditServerDetail visibleEdit={visibleEdit} changeVisibleType = {this.changeVisibleType} getListData={this.getListData} rowId={rowId} logid={logid} name={name}/>
            </div>
        )
    }
}