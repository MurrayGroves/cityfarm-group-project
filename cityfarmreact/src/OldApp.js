import './App.css';
import { Component } from 'react';
import { useState } from 'react';
import api from "../api/axiosConfig";

class OldApp extends Component {

  state = {
    animals: []
  };

  async componentDidMount() {
    /*
    const response = await fetch('/animals');
    const body = await response.json();
    this.setState({animals: body});
    */
  }

  render() {
    const {animals} = this.state;
    return (
      <div>
        {/*
        <h1>Bristol City Farm Livestock Management</h1>
        <div>
            <h2>Animals</h2>
            {animals.map(animal =>
                <div key={animal.id}>
                  {animal.name}
                </div>
            )}
        </div>
        */}
        
        <h1>Test</h1>

        <table>
          <tr>
            <th>Test</th>
            <th>Test2</th>
          </tr>
          <tr>
            <td>test</td>
            <td>test2</td>
          </tr>
        </table>
      </div>
    );
  }
}

export default OldApp;
