import React,{Component} from 'react';
import {Calendar,Icon,LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
//import moment from 'moment';

export default class DutyCalendar extends Component{
 
    onSelect=(value) =>{
        console.log(value)
    }
    render(){
        return(
            <div className='duty'>
            <div className='page-title'>
            <span>　<Icon type='solution' style={{ fontSize: 22 }} /> 值班日历</span>
            <font>
            </font>
            </div>
            <LocaleProvider locale={zh_CN}>
            <Calendar style={{marginTop:'1%'}}  onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
            </LocaleProvider>
            </div>
        )
    }
}