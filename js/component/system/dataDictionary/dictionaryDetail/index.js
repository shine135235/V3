import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddEventCategory from "./addDictionaryDetail";
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
            totalRecord:0
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
                <a href='javascript:void(0)'  onClick= {this.showModal.bind(this,record)}>编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick = {this.Delet.bind(this,record)}>删除</a>
            </span>
        ), 
    }]; 
    showModal = (record) =>{
        this.setState({record,editVisible:true});
    }
    getDataList =({pageNum=1,pageSize=10}) =>{
        $axios.get(`${config.api_server}/sys/dictitem/query/itemlist?pageNum=${pageNum}&pageSize=${pageSize}`).then(res =>{
                if(res.data.page.datas){
                    this.setState({dataList:res.data.page.datas})
                    this.setState({totalRecord:res.data.page.totalRecord})
                }       
        })
    }
    componentDidMount(){
          this.getDataList({});
    }
    success = () => {                       //操作完成提示弹框
        const modal = Modal.success({       // success('操作成功!');
            title: '操作成功',
            content: '删除字典项成功',
          });
          setTimeout(() => modal.destroy(), 2000);
    };
    error = () => {
        const modal = Modal.error({         // success('操作成功!');
            title: '操作失败',
            content: '删除字典项失败',
          });
          setTimeout(() => modal.destroy(), 2000);
    };
    Delet = (record) => {
        // //eslint-disable-next-line
        //  console.log("ssssss",record);
         let records = record.id;
        confirm({
            title: '确定要删除此条信息吗?',
            content: '删除的内容？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',  
            onOk:() => {
                $axios.get(`${config.api_server}/sys/dictitem/delete?id=${records}`).then(res =>{
                    //eslint-disable-next-line
                    console.log(res.data.success);
                    let datas = res.data.success;
                    if(datas == true){
                        this.getDataList({});
                            setTimeout(() => {
                                this.success();
                            }, 3000);
                    }else{
                        setTimeout(() => {
                            this.error();
                        }, 3000);
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
        this.getDataList({pageNum:current,pageSize:size})
    } 
    onChange = (page, pageSize) =>{
        this.getDataList({pageNum :page,pageSize:pageSize})
    }
    changeT = ({editVisible=false}) =>{
        this.setState({editVisible})
    }
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    refresh = () =>{
        this.getDataList({});
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
        return (
            <div className='data-class-overKnow'>
                {/* <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>自定子类型管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }}/>
                        <Button  onClick = {this.refresh}>刷新</Button>
                        <AddEventCategory getDataList = {this.getDataList} />
                    </div>
                </div> */}
                <div className = 'eventTitle'>
                        <AddEventCategory getDataList = {this.getDataList} />
                        <Button onClick = {this.refresh} style = {{"marginLeft":"10px"}}>刷新</Button>
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