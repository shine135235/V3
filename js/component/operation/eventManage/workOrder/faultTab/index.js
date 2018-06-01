import React,{Component} from 'react';
import { Tabs } from 'antd';
import $axios from 'axios';
import EditWorkOrder from '../editWorkOrder';
import ProcessWorkOrder from '../processWorkOrder';
import config from '../../../../../config'
import './index.less';

const TabPane = Tabs.TabPane;
export default class FaultTab extends Component {
    callback = (key) => {
        // eslint-disable-next-line
        console.log(key);
    }
    componentDidMount(){
        let rowId = this.props.rowId;
        $axios.get(`${config.api_server}/ops/workorder/list?id=${rowId}`).then((json) => {
            // eslint-disable-next-line
            console.log("detail",json)
        })

    }
    render(){
        return(
            <div className='faultTab'>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="故障详情" key="1">
                        <EditWorkOrder changeShowType = {this.props.changeShowType} rowData={this.props.rowData} />
                    </TabPane>
                    <TabPane tab="故障处理" key="2">
                        <ProcessWorkOrder changeShowType = {this.props.changeShowType} />
                    </TabPane>
                    <TabPane tab="故障评价" key="3">Content of Tab Pane 3</TabPane>
                    <TabPane tab="故障流转" key="4">Content of Tab Pane 4</TabPane>
                </Tabs>
            </div>
            
        )
    }
}
