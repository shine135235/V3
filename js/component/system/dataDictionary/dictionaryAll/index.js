import React,{Component} from 'react';
import axios from 'axios';
import { Button,Input,Table,LocaleProvider,Modal} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddEventCategory from "./addDictionaryAll";
import EditDictionaryAll from "./editDictionaryAll";

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
            tatalRecord:0
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
                <a href="#" onClick= {this.showModal.bind(this,record)}>编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick = {this.Delet.bind(this,record)}>删除</a>
            </span>
        ), 
    }];
    showModal = (record) =>{
        this.setState({record,editVisible:true});
    }
    getParentListData = ({pageNum=1,pageSize=10}) => {
        axios.get(`http://172.16.6.11:9090/sys/dict/queryall?pageNum=${pageNum}&pageSize=${pageSize}`).then((res) =>{
            if(res.data.page.datas){
                this.setState({data:res.data.page.datas})
                this.setState({tatalRecord:res.data.page.datas.tatalRecord})
            }
        })
    }

    componentDidMount(){
        this.getParentListData({});
    }
    refresh = () =>{
        this.getParentListData({});
    }
    success = () => {                       //操作完成提示弹框
        const modal = Modal.success({       // success('操作成功!');
            title: '操作成功',
            content: '删除字典类别成功',
          });
          setTimeout(() => modal.destroy(), 1000);
    };
    error = () => {
        const modal = Modal.error({         // success('操作成功!');
            title: '操作失败',
            content: '删除字典类别失败',
          });
          setTimeout(() => modal.destroy(), 1000);
    };
    Delet = (record) => {
        let records = record.id;
        confirm({
            title: '确定要删除此条信息吗?',
            content: '删除的内容？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:() => {
              axios.get(`http://172.16.6.11:9090/sys/dict/delete?id=${records}`).then(res =>{
                    let datas = res.data.success;
                    if(datas == true){
                        this.getParentListData({});
                            setTimeout(() => {
                                this.success();
                            }, 1000);
                    }else{
                        setTimeout(() => {
                            this.error();
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
    onSearch = (value) =>{
        let pageNum = 1;
        let pageSize = 10;
        let searchValue = value;
        axios.get(`http://172.16.6.11:9090/sys/dict/query/fuzzy?pageNum=${pageNum}&pageSize=${pageSize}&param=${searchValue}`).then((res) =>{
            if(res.data.page.datas){
                this.setState({data:res.data.page.datas})
                this.setState({tatalRecord:res.data.page.datas.tatalRecord})
            }
        })

    }
    render(){
        const pagination = {
            showQuickJumper:true,
            onShowSizeChange:this.onShowSizeChange,
            onChange:this.onChange,
            total:this.state.tatalRecord,
            showTotal:this.showTotal,
            showSizeChanger:true,
            size:"small",
        }
        return (
            <div className='data-class-over'>
                <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>自定义父类型管理</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }} onSearch={this.onSearch}/>
                        <Button  onClick = {this.refresh}>刷新</Button>
                        <AddEventCategory getParentListData = {this.getParentListData} dataList = {this.state.data}/>
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