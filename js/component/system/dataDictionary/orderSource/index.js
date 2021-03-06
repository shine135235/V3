import React,{Component} from 'react';
import { Button,Input,Table,Modal,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddEventCategory from "./addOrderSource";
import EditEventCategory from "./editOrderSource";
import './orderSource.less';

const Search = Input.Search;
const confirm = Modal.confirm;
const data = [{
    key: '1',
    eventNane: '应用系统',
  }, {
    key: '2',
    eventNane: '视频会议',
  }, {
    key: '3',
    eventNane: '安防监控',
  }, {
    key: '4',
    eventNane: '校园网',
  }];

export default class ChildArea extends Component{
    columns = [{
        title:"工单来源",
        dataIndex:"eventNane",
        key:"eventNane"
      },{
        title:"操作",
        key:"action",
        render:(text, record) => (
            <span>
                <a href="#" onClick= {this.Edit.bind(this,record.key)}>编辑</a>
                <span className="ant-divider" />
                <a href="#" onClick = {this.Delet.bind(this,record.key)}>删除</a>
            </span>
        ), 
      }];
    state = {
        editLoading: false,
        editVisible: false,
        addVisible:false,
        addLoading:false,
      }
     
    componentDidMount(){
         
    }
    AddNew = () => {
        this.setState({
           addVisible: true,
           editVisible: false,
          });
    }
    Delet = (kk) => {
        //eslint-disable-next-line
        console.log(kk);
        confirm({
            title: '确定要删除此条信息吗?',
            content: '删除的内容？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                 //eslint-disable-next-line
              console.log('OK');
            },
            onCancel() {
                 //eslint-disable-next-line
              console.log('Cancel');
            },
          });
          this.setState({
            addVisible: false,
            editVisible: false,
           });
    }
    Edit = (e) => {
         //eslint-disable-next-line
         console.log(e);
         this.setState({
            editVisible: true,
            addVisible:false,
          });
    }
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
                    <span>工单来源管理</span> 
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
                    <AddEventCategory addVisible = {this.state.addVisible}/>
                    <EditEventCategory editVisible = {this.state.editVisible}/>
                   
                </div>
            </div>
        )
    }
}