import React, { Component } from "react";
import { Button , Input , Table ,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './index.less'


const Search = Input.Search;
export default class AppIntegrate extends Component {
    state = {
        data:[],
    }
    handleMenuClick = (e) => {
        //eslint-disable-next-line
        console.log("click",e);
    }

    columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="#">{text}</a>,
      }, {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      }, {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      }, {
        title: 'Action',
        key: 'action',
        render: () => (
          <span>
            <a href="javascript:void 0">清零</a>
          </span>
        ),
      }];
      rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            //eslint-disable-next-line
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
      };
    componentDidMount(){
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
          }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
          }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
          }];
          this.setState({
              data,
          })
    }
    searchFunc = (value) => {
        //eslint-disable-next-line
        console.log(value);
    }
    // showTotal = (total, range) => {
    //     //eslint-disable-next-line
    //     console.log(total,"++++++++++++++++",range);
    //     return `共 ${total} 条记录 第${range[0]}/${range[1]} `
    // }
    onChange = (page, pageSize) => {
        
        //eslint-disable-next-line
        console.log(page,"+++++",pageSize);
    }
    onShowSizeChange = (current, size) => {
        
        //eslint-disable-next-line
        console.log(current,"+++++",size);
    }
    render(){
        const pagination = {
            size:'small',
            total:3,
            showSizeChanger:true,
            showQuickJumper:true,
            onChange:this.onChange,
            onShowSizeChange:this.onShowSizeChange,
        }
        return(
            <div className='appintegrate'>
                <div className='appintegrate_topBtns'>
                    <Button type="primary">全部清零</Button>
                    <Search
                        placeholder="请输入..."
                        style={{ 'width': '20%' }}
                        onSearch={this.searchFunc}
                    />
                </div>
                <div className='appintegrate_table'>
                    <LocaleProvider locale={zhCN}>
                        <Table rowSelection={this.rowSelection} columns={this.columns} dataSource={this.state.data} pagination={pagination} />
                    </LocaleProvider>
                </div>
            </div>
        )
    }
}