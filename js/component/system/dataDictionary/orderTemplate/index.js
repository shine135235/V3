import React,{Component} from 'react';
// import axios from 'axios';
import { Button,Input,Table,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';


const Search = Input.Search;

const data = [{
    key: '1',
    FIELDNAME: '基础模板'
  }];

export default class ChildArea extends Component{
    constructor(props){
        super(props)
        this.state={
 
        }
    }
    columns = [{
        title:"模板名称",
        dataIndex:"FIELDNAME",
        key:"FIELDNAME"
      },{
        title:"操作",
        key:"action",
        render:() => (
            <span>
                <a href="#" >预览</a>
                <span className="ant-divider" />
                <a href="#" >编辑</a>
                <span className="ant-divider" />
                <a href="#">删除</a>
            </span>
        ), 
      }];
      componentDidMount(){
 
    }
  
    render(){
        const pagination = {
            showQuickJumper:true,
            total:50,
        }
        return (
            <div className='data-class-over'>
                <div className = 'eventTitle'>
                    <span className="titleLeft"></span>
                    <span>工单模版</span> 
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
                </div>
            </div>
        )
    }
}