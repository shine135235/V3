import React,{Component} from 'react';
import {Table,Icon} from 'antd'
import '../index.less';


const columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '值班日期',
    dataIndex: 'date',
    key: 'date',
  }, {
    title: '值班类别',
    dataIndex: 'type',
    key: 'type',
  }, {
    title: '公司名称',
    dataIndex:'company',
    key: 'cname',
  },{
    title: '值班人数',
    dataIndex:'num',
    key: 'num',
  },{
    title: '操作',
    key: 'action',
    render: () => (
      <span>
        <a href="javascript:;">text</a>
      </span>
    ),
  }];

  const data = [{
    key: '1',
    name: 'John Brown',
    date: '2018-05-29',
    company:'测试数据',
    num:'3',
    type: '白班',
  }, {
    key: '2',
    name: 'aaa',
    date:'2018-05-29',
    num:'3',
    company:'测试数据',
    type: '白班',
  }, {
    key: '3',
    name: 'Joe Black',
    date:'2018-05-29',
    company:'测试数据',
    num:'3',
    type: '白班',
  }];
export default class DutyTable extends Component{
    render(){
        return(
            <div className='duty'>
             <div className='page-title'>
            <span>　<Icon type='solution' style={{ fontSize: 22 }} /> 值班表</span>
            <font>
            </font>
            </div>
            <Table style={{width:'98%',marginLeft:'1%'}} columns={columns} dataSource={data} />
            </div>
        )
    }
}