import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider,message,Modal, Pagination} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddSysProject from "./addSysProject";
import EditSysProject from "./editSysProject";
import config from '../../../../config';
import './index.less';

const Search = Input.Search;
const confirm = Modal.confirm;
export default class SysProject extends Component{
    constructor(props){
        super(props)
        this.state={
            totalCount:0,
            visibleEdit:false,
            row:{},
            data:[],
            totalRecord:0,
            rowId:"",
            Name:"",
            quality:"",
            CodeName:"",
            fphone:"",
            sphone:"",
            supervisor:"",
            first_party:"",
            users:[],
            vendorDataJL:[],
            vendorDataJF:[],
            pageNum:1,
            pageSize:10,
            searchVal:"",
        }
    }
    columns = [{
        title:"项目名称",
        dataIndex:"name",
      },{
        title:"合同编号",
        dataIndex:"codename",
      },{
        title:"质保情况",
        render:(text,row) => {
            let qualityText = ""
            if(row.quality == 1){
                qualityText = "保内"
            }else if(row.quality == 0){
                qualityText = "保外"
            }else{
                qualityText = "不确定"
            }
            return(
                <span>{qualityText}</span>
            )
        }
      },{
        title:"甲方负责人",
        render:(text,row) => {
            let qualityText = "";
            let data=this.state.vendorDataJF;
            for(let i=0;i<data.length;i++){
                if(row.first_party == data[i].id){
                    qualityText = data[i].username
                }
            }
            return(
                <span>{qualityText}</span>
            )
        }
      },{
        title:"联系电话",
        dataIndex:"fphone",
      },{
        title:"监理",
        render:(text,row) => {
            let qualityText = "";
            let data=this.state.vendorDataJL;
            for(let i=0;i<data.length;i++){
                if(row.supervisor == data[i].id){
                    qualityText = data[i].username
                }
            }
            return(
                <span>{qualityText}</span>
            )
        }
      },{
        title:"联系电话",
        dataIndex:"sphone",
      },{
        title:"参与人",
        dataIndex:"names",
      },{
        title:"操作",
        key:"action",
        render:(text,row) => (
            <span>
                <a href="#" onClick={this.editSysProjectShow.bind(this,row.id)}>编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick={this.deleteRowData.bind(this,row.id)}>删除</a>
            </span>
        ), 
      }];
      deleteRowData = (rowId) => {
        confirm({
            title: '删除项目',
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
        this.delSysProjectData(rowIds);
    }
    delSysProjectData = (idString) => {
        $axios.put(`${config.api_server}/pro/project/${idString}`).then((json) => {
            if(json.data.success == true){
                this.success("删除成功");
                this.getListData({});
            }else{
                this.error('删除失败');
            }
        })
      }
      editSysProjectShow = (rowId) => {
        $axios.get(`${config.api_server}/pro/project?id=${rowId}`).then((json) => {
            //eslint-disable-next-line
            console.log("editSysProjectShow",json);
            // let row = json.data.data;
            let Name = json.data.data.name;
            let quality = json.data.data.quality.toString();
            let CodeName = json.data.data.codename;
            let first_party = json.data.data.first_party;
            let supervisor = json.data.data.supervisor;
            let usersArr = json.data.data.users;
            let users = []
            if(usersArr.length > 0){
                for(let i = 0;i<usersArr.length;i++){
                    users.push(usersArr[i].id);
                }
            }
            let sphone = json.data.data.sphone;
            let fphone = json.data.data.fphone;
            let rowId = json.data.data.id;
            this.setState({
                rowId,
                Name,
                quality,
                CodeName,
                fphone,
                sphone,
                supervisor,
                first_party,
                users,
                visibleEdit:true,
            })
        })
      }
      success = (info) => {
        message.success(info);
    };
    error = (info) => {
        message.error(info);
    };
      getListData = ({pageNum = this.state.pageNum,pageSize = this.state.pageSize,searchVal = this.state.searchVal}) => {
        $axios.get(`${config.api_server}/pro/projectList?pageNum=${pageNum}&pageSize=${pageSize}&mohu=${searchVal}`).then((json) => {
            //eslint-disable-next-line
            console.log("列表数据",json);
            let data = json.data.page.datas;
            let totalRecord = json.data.page.totalRecord;
            this.setState({
                data,
                totalRecord,
            })
        })
      }
      getUserJfData = () => {
        // let userId = sessionStorage.getItem("user").id;
        $axios.post(`${config.api_server}/sys/user/selectlist`,{
            // "unitid":userId,
            "unitcode":3,
            "unittype":"JSDW"
        }).then((json) => {
            //eslint-disable-next-line
            console.log("甲方",json);
            let vendorDataJF = json.data;
            this.setState({
                vendorDataJF,
            })
        })
    }
    getUserJLData = () => {
        // let userId = sessionStorage.getItem("user").id;
        $axios.post(`${config.api_server}/sys/user/selectlist`,{
            // "unitid":userId,
            "unitcode":1,
            "unittype":"JLDW"
        }).then((json) => {
            //eslint-disable-next-line
            console.log("监理",json);
            let vendorDataJL = json.data;
            this.setState({
                vendorDataJL,
            })
        })
    }
      componentDidMount(){
          this.getListData({})
          //获取甲方负责人
        this.getUserJfData();
        //获取监理负责人
        this.getUserJLData();
    }
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    changeVisibleEdit = ({visibleEdit = false}) => {
        this.setState({
            visibleEdit,
        })
    }
    onChange = (page, pageSize) => {
        this.setState({
            pageNum:page,pageSize:pageSize
        })
        this.getListData({pageNum:page,pageSize:pageSize});
    }
    onShowSizeChange = (current, size) =>{
        this.setState({
            pageNum:current,pageSize:size
        })
        this.getListData({pageNum:current,pageSize:size});
    }
    searchFunc = (value) => {
        //eslint-disable-next-line
        console.log(value);
        this.setState({
            searchVal:value
        })
        this.getListData({});
    }
    refreshData = () => {
        this.getListData({})

    }
    render(){
        const {visibleEdit,totalRecord,data,rowId,
                Name,
                quality,
                CodeName,
                fphone,
                sphone,
                supervisor,
                first_party,
                users} = this.state;
        return (
            <div className='data-class-over'>
                <div className = 'sysProjectTitle'>
                    <span className="sysProjectTitleLeft"></span>
                    <span>项目管理</span> 
                    <div className = "sysProjectTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }} onSearch={this.searchFunc}/>
                        <Button onClick={this.refreshData}>刷新</Button>
                        <AddSysProject getListData={this.getListData}/>
                    </div>
                </div>
                <div  style={{"height":"86%","overflowY":"auto"}}>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={data}  pagination = {false} columns={this.columns} />          
                    </LocaleProvider>
                </div>
                <div style={{"position":"absolute","right":"1.25%","marginTop":"12px"}}>
                    <LocaleProvider locale = {zhCN}>
                        <Pagination 
                            showQuickJumper={true}
                            total={totalRecord}
                            showTotal={this.showTotal}
                            showSizeChanger={true}
                            size="small"
                            onChange={this.onChange}
                            onShowSizeChange={this.onShowSizeChange}
                        />          
                    </LocaleProvider>
                </div>
                <EditSysProject getListData={this.getListData} visibleEdit={visibleEdit} changeVisibleEdit = {this.changeVisibleEdit} name={Name} quality={quality} CodeName={CodeName} fphone={fphone} sphone={sphone} supervisor={supervisor} first_party={first_party} users={users} rowId={rowId}/>
            </div>
        )
    }
}