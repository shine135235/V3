import React,{Component} from 'react';
import axios from 'axios';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export default class UserPower extends Component{
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys:[''],
        selectedKeys: [],
        powerData:[],
      }
      componentDidMount(){
        this.getPowerData(this.props.roleid)
      }
      componentWillReceiveProps(){
          console.log(this.props.roleid)
        this.getPowerData(this.props.roleid)
      }
      getPowerData=(key) =>{
            axios.get('http://172.16.6.5:9090/sys/permission',{
                params:{
                    roleid:key
                }
            }).then(res =>{
                this.setState({
                    powerData:res.data.power,
                    checkedKeys:res.data.hasPower
                })
            })
        }
      onCheck = (checkedKeys,v) => {
        let subKeys=[...checkedKeys];
          if(v.halfCheckedKeys.length>0){
              v.halfCheckedKeys.map(item =>(
                subKeys.push(item)
              ))
          }
        console.log(subKeys)
        //console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
      }
      renderTreeNodes = (data) => {
        return data.map((item,i) => {
          if (item.children) {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode key={i} {...item} />;
        });
      }
      render() {
        if(this.state.powerData.length>0){
            console.log(this.state.checkedKeys)
            return (
             <div className='power-list'>
             <div className='power-group'>
                    <div className='power-list-item'>
                        <Tree
                        checkable
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        defaultCheckedKeys={this.state.checkedKeys}
                        >
                            {this.renderTreeNodes(this.state.powerData)}
                        </Tree>
                    </div>
               </div>
              </div>
            );
        }else{
            return(
                <div className='power-list'></div>
            )
        }
        
      }
}
