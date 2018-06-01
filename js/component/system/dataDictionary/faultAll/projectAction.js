import React,{Component} from 'react';
import axios from 'axios';
import {Button,Input,Table,LocaleProvider,Modal,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
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
            tatalRecord:0,
            record:{},
            data:[],
            name:"",
            initialSlect:[],
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
                <a href="#" onClick = {this.Delet.bind(this,record)} >删除</a>
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
                this.setState({tatalRecord:res.data.page.datas.tatalRecord})
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
    Delet = (record) => {
        //eslint-disable-next-line
        console.log(record);
        let records = record.id;
        let recordName = record.faultname;
        let recordcont = record.projectname;
        confirm({
            title: `确定要删除${recordName}`,
            content: recordcont,
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:() => {
                 //eslint-disable-next-line
              console.log('OK');
              axios({
                url:"http://172.16.6.5:9090/sys/faultcategory",
                method:'delete',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "id":records
                }
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.getParentListData({});
                    setTimeout(() => {
                        this.setState({ addLoading: false, addVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ addLoading: false});
                    setTimeout(() => {
                        this.error();
                    }, 1000);
                }
           })
            },
            onCancel:() => {
                 //eslint-disable-next-line
            //   console.log('Cancel');
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
    refresh = () =>{
        this.getParentListData({});
    }
    onSearch = (value) =>{
        let pageNum = 1;
        let pageSize = 10;
        let search = value;
        this.getParentListData({pageNum,pageSize,search});
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
            <Modal
                    visible={this.state.addVisible}
                    title="添加故障细类"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    onFieldsChange = {this.onFieldsChange}
                    // afterClose = {this.afterClose}
                    destroyOnClose={true}
                    footer={[
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.addHandleOk}>
                        保存
                        </Button>,
                    ]}
                >
                <div className='data-class-over'>
                    <div className = 'eventTitle'>
                        <span className="titleLeft"></span>
                        <div className = "eventTitleSearch">
                            <Search placeholder="搜索"  style={{ width: 200 }} onSearch={this.onSearch}/>
                        </div>
                        <span>故障大类管理</span> 
                    </div>
                    <div>
                        <LocaleProvider locale = {zhCN}>
                            <Table dataSource={this.state.data}  pagination = {pagination} columns={this.columns} />          
                        </LocaleProvider>
                    </div>
                </div>
            </Modal> 
        )
    }
}