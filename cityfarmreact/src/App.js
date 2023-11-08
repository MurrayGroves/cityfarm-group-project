import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class App extends Component {

  state = {
    animals: []
  };

  async componentDidMount() {
    const response = await fetch('/animals');
    const body = await response.json();
    this.setState({animals: body});
  }

  render() {
    const {animals} = this.state;
    return (
      <div>
        <h1>Bristol City Farm Livestock Management</h1>
        <div>
            <h2>Animals</h2>
            {animals.map(animal =>
                <div key={animal.id}>
                  {animal.name}
                </div>
            )}
            <p>{animals.length}</p>
        </div>
      </div>
    );
  }
}

export default App;
