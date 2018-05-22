import React,{Component} from 'react';
// import axios from 'axios';
import { Button,Input,Table,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import AddEventCategory from "./addEventCategory";
// import EditEventCategory from "./editCategory";
// import './projectAdministration.less';

const Search = Input.Search;
// const confirm = Modal.confirm;
const data = [
//     {
//     key: '1',
//     CNAME:"摄像头",
//     PNAME:"网络设备",
//     FNAME:"断线"
//   }, {
//     key: '2',
//     CNAME:"宕机",
//     PNAME:"负载均衡",
//     FNAME:"漏洞"
//   }
];

export default class ChildArea extends Component{
    constructor(props){
        super(props)
        this.state={
            // editLoading: false,
            // editVisible: false,
            // addVisible:false,
            // addLoading:false,
            // parentID:this.props,
            // childs:[]
        }
    }
    columns = [{
        title:"时间点",
        dataIndex:"FNAME",
        key:"FNAME"
      },{
        title:"时间单位",
        dataIndex:"PNAME",
        key:"PNAME"
      },{
        title:"颜色",
        dataIndex:"CNAME",
        key:"CNAME"
      },{
        title:"操作",
        key:"action",
        render:() => (
            <span>
                <a href="#" >编辑</a>
                <span className="ant-divider" />
                <a href="#">删除</a>
            </span>
        ), 
      }];
      componentDidMount(){
        // axios.get('/data/sjzd/eventCategory.json').then(res =>{
        //     res.data.forEach(child => {
        //         // eslint-disable-next-line
        //         // console.log(this.state.parentID)
        //         // if(this.state.parentID==child.parentID){
        //             this.setState({
        //                 childs:child.dataClass
        //             })
        //         // }
        //     })
        // })
    }
    // AddNew = () => {
    //     this.setState({
    //        addVisible: true,
    //        editVisible: false,
    //       });
    //       setTimeout(() => {
    //         this.setState({
    //             addVisible: false,
    //             editVisible: false,
    //            });
    //       })
       
    // }
    // Delet = (kk) => {
    //     //eslint-disable-next-line
    //     console.log(kk);
    //     confirm({
    //         title: '确定要删除此条信息吗?',
    //         content: '删除的内容？',
    //         okText: '是',
    //         okType: 'danger',
    //         cancelText: '否',
    //         onOk() {
    //              //eslint-disable-next-line
    //           console.log('OK');
    //         },
    //         onCancel() {
    //              //eslint-disable-next-line
    //           console.log('Cancel');
    //         },
    //       });
    //       this.setState({
    //         addVisible: false,
    //         editVisible: false,
    //        });
    // }
    // Edit = () => {
    //      //eslint-disable-next-line
    //     // console.log(e);
    //      this.setState({
    //         editVisible: true,
    //         addVisible:false,
    //       });
    //       setTimeout(() => {
    //         this.setState({
    //             editVisible: false,
    //         addVisible:false,
    //            });
    //       })
    // }
    // editHandleOk = () => {
    //     this.setState({ editLoading: true });
    //     setTimeout(() => {
    //       this.setState({ editLoading: false, editVisible: false });
    //     }, 3000);
    // }
    // editHandleCancel = () => {
    //     this.setState({ editVisible: false });
    // }
    // addHandleOk = () => {
    //     this.setState({ addLoading: true });
    //     setTimeout(() => {
    //       this.setState({ addLoading: false, addVisible: false });
    //     }, 3000);
    // }
    // addHandleCancel = () => {
    //     this.setState({ addVisible: false });
    // }
    render(){
        const pagination = {
            showQuickJumper:true,
            total:50,
            showSizeChanger:true,
            size:"small",

        }
        return (
            <div className='data-class-over'>
                <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>SLA提醒、资产管理提醒</span> 
                    <div className = "eventTitleSearch">
                        <Search placeholder="搜索"  style={{ width: 200 }}/>
                        <Button >刷新</Button>
                        <Button type="primary" onClick = {this.AddNew} icon="plus">新建</Button>
                    </div>
                </div>
                <div>
                    <LocaleProvider locale = {zhCN}>
                        <Table dataSource={data}  pagination = {pagination} columns={this.columns} />          
                    </LocaleProvider>
                    {/* <Modal
                        visible={this.state.editVisible}
                        title="编辑事件类型"
                        onOk={this.editHandleOk}
                        onCancel={this.editHandleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.editLoading} onClick={this.editHandleOk}>
                            保存
                            </Button>,
                        ]}
                    >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    </Modal> */}    
                    {/* <AddEventCategory addVisible = {this.state.addVisible}/>
                    <EditEventCategory editVisible = {this.state.editVisible}/> */}
                   
                </div>
            </div>
        )
    }
}