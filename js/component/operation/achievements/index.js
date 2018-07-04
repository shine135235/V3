import React,{Component} from 'react';
// import './index.less'
import {Menu } from 'antd';
import axios from 'axios';

// const SubMenu = Menu.SubMenu;
export default class Achievements extends Component{
    constructor(props){
        super(props);
        this.state={
            pid:"1",
            deptData:[]
        }
    }
    // onChange  = (e) =>{
    //     this.setState({
    //         pid:e.target.value
    //     })
    // }
    componentDidMount (){
        this.getMenuList()
    }
    getMenuList = () =>{
        console.log(11111111111111111111111)
        axios.get("./data/achievementsMenu.json").then((res) =>{
            console.log("ssssssssssssss",res)
        })
    }
    render(){
        return (
            <div className='role-content'>
                <div className='department'>
                    <Menu>
                        
                    </Menu>
                </div>
            </div>
        )
    }
}
