import React,{Component} from 'react';
import { Tabs} from 'antd';

import EditWorkOrder from '../editWorkOrder';
import ProcessWorkOrder from '../processWorkOrder';
import EvalWorkOrder from '../evalWorkOrder';
import TranData from '../tranWorkOrder';
import './index.less';


const TabPane = Tabs.TabPane;
export default class FaultTab extends Component {
    state={
        active:'1',
        Process:true,
        Commend:true,
        Trans:true,
    }
    callback = (key) => {
        this.setState({
            active:key
        })
    }
   
    componentDidMount(){
        console.log(this.props.only,this.props.orderStatus)
        if(this.props.only==0){
            if(parseInt(this.props.orderStatus)<5){
                this.setState({
                    active:'1',
                    // Commend:false,
                    Trans:false
                })
            }else if(this.props.orderStatus=='5'){
                this.setState({
                    active:'2',
                    Process:false
                })
            }else if(this.props.orderStatus>='6'){
                this.setState({
                    active:'3',
                    Process:false,
                    Commend:false
                })
            }
        }else if(this.props.only==3){
            if(this.props.orderStatus=='6'){
                this.setState({
                    active:'2',
                    Process:false
                })
            }else{
                this.setState({
                    active:'1',
                    Trans:false
                })
            }
            
        }else {
            this.setState({
                active:'4',
                Process:false,
                Commend:false,
                Trans:false
            })
        }
        
    }
    
    render(){
        return(
            <div className='faultTab'>
                <Tabs activeKey={this.state.active} onChange={this.callback}>
                    <TabPane tab="故障详情" key="1">
                        <EditWorkOrder changeShowType = {this.props.changeShowType} rowData={this.props.rowData} orderStatus={this.props.orderStatus} refreshData={this.props.refreshData} only={this.props.only} />
                    </TabPane>
                    <TabPane tab="故障处理" key="2" disabled={this.state.Process}>
                        <ProcessWorkOrder changeShowType = {this.props.changeShowType} rowData={this.props.rowData} orderStatus={this.props.orderStatus} refreshData={this.props.refreshData} only={this.props.only} />
                    </TabPane>
                    <TabPane tab="故障评价" key="3" disabled={this.state.Commend}>
                    <EvalWorkOrder changeShowType = {this.props.changeShowType} rowData={this.props.rowData} orderStatus={this.props.orderStatus} refreshData={this.props.refreshData} only={this.props.only} />
                    </TabPane>
                    <TabPane tab="故障流转" key="4">
                        <TranData changeShowType = {this.props.changeShowType} rowData={this.props.rowData} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

