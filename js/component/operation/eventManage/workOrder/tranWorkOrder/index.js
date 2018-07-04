import React,{Component} from 'react'
import { Table,Button} from 'antd';
import axios from 'axios';
import config from '../../../../../config';

export default class TranData extends Component{
    state={
        tableData:[]
    }
    componentWillMount(){
        axios.get(`${config.api_server}/ops/workorder/loglist`,{
            params:{
                id:this.props.rowData
            }
        }).then(res =>{
            this.setState({
                tableData:res.data.page.datas
            })
        })
    }
    goBack=() =>{
        this.props.changeShowType('list')
    }
    render(){
        const columns = [{
            title: '工单状态',
            dataIndex: 'action',
            key: 'name',
          }, {
            title: '处理时间',
            dataIndex: 'time',
            key: 'time',
          }, {
            title: '处理人',
            dataIndex: 'userinfo',
            key: 'user',
          }];
        return(
            <div>
                <Table title={() => '工单流程'} footer={() =><Button onClick={this.goBack} style={{"marginLeft":"1%"}}>返回</Button>} pagination={false} bordered columns={columns} dataSource={this.state.tableData}></Table>
                
            </div>
        )
    }
}