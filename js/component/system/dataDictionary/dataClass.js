import React,{Component} from 'react';
import axios from 'axios';
import {Menu} from 'antd';
import {Link} from 'react-router-dom';


const SubMenu=Menu.SubMenu;

export default class DataClass extends Component{
    constructor(props){
        super(props)
        this.state={
            parentID:this.props.pid,
            childs:[]
        }
    }
    handelClick=(e) =>{
        // eslint-disable-next-line
       // console.log(11111)
       if(e.key=="event0"){
           // eslint-disable-next-line
          // console.log(11111)
       }
    }
    componentDidMount(){
        axios.get('/data/sjzd/dataClass.json').then(res =>{
            res.data.forEach(child => {
                if(this.state.parentID==child.parentID){
                    this.setState({
                        childs:child.dataClass
                    })
                }
            })
        })
    }
    render(){
        return(
            <div className='data-class'>
            <Menu mode="inline" onClick = {this.handelClick}>
             {
                 this.state.childs.map((item,i) =>{
                     if(item.childList){
                         return(
                            <SubMenu key={i++} title={<span>{item.menu}</span>}>
                            {
                                        item.childList.map((chunk,v) =>{
                                            return (
                                                <Menu.Item key={`${chunk.key}`+v}>     
                                                <Link to={{
                                                    pathname:`${chunk.pathname}`,
                                                    state:{
                                                        id:`${chunk.id}`
                                                    }
                                                }}>
                                                {chunk.menu}
                                                </Link>
                                                </Menu.Item>
                                            );
                                        })
                                    }
                             </SubMenu>
                         )
                     }else{
                        return (
                            <Menu.Item key={i}>
                            <Link to={`${item.pathname}`}>
                            {item.menu}
                            </Link>
                            </Menu.Item>
                        )
                     }
                 })
             }
            </Menu>
            </div>
        )
    }
}