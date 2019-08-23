import React, { Component } from "react";
import TodoList from "./contracts/TodoList.json";
import getWeb3 from "./utils/getWeb3";
import "bootstrap/dist/css/bootstrap.min.css"

import "./App.css";

class App extends Component {
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null, 
    todos:[],
    newTodo:""
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoList.networks[networkId];
      const instance = new web3.eth.Contract(
        TodoList.abi,
        deployedNetwork && deployedNetwork.address,
      );


      instance.events.CompleteTodo()
      .on('data', (event) =>{
          console.log(event); // same results as the optional callback above
         // this.setState({todos:event.returnValues.todos})
      })
      .on('changed', (event) => {
          // remove event from local database
      })
      .on('error', console.error);




      this.setState({ web3, accounts, contract: instance }, () => {
        try {
          this.getTodos()
        } catch(e) {
          console.log(e)
        }
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getTodos = async () => {
    const { contract } = this.state;
    const list = await contract.methods._getList().call()
    this.setState({todos:list})
  }


  add = async todo => {
    const { accounts, contract, todos } = this.state;
    const added = await contract.methods._add(todo).send({ from: accounts[0] });

    this.getTodos();
  }

  completeTodo = async id => {
    if (this.state.todos[id].isComplete) {
      return alert("Todo was completed already");
    }
    const { accounts, contract, todos } = this.state;
    const completed = await contract.methods._completeTodo(id).send({ from: accounts[0] });
    this.getTodos();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="container">
      <br/>
        <div
          className="row justify-content-center align-items-center h-100"
          style={{

          }}>
          <input 
            className="justify-content-center"
            style={{
              width:"200px", 
              borderWidth:1, 
              borderColor:"black", 
            }}
            type="text" 
            onChange={e => this.setState({newTodo:e.target.value})}/>
          <button onClick={() => this.add(this.state.newTodo)}>
            add
          </button>
        </div>
        <br/>
        <div style={{width:"50%"}}>
        {
          this.state.todos.map((i, idx) => (
            <div  
              onClick={() => this.completeTodo(idx)}
              key={idx}
              style={{
                width:"auto",
                cursor: "pointer",
                textDecoration:i.isComplete ? "line-through" : "none"
              }}>
              {i}
            </div>

          ))
        }
        </div>

      </div>
    );
  }
}

export default App;
