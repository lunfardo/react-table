import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NiceTable from './NiceTable';

const fields = [
  {name: "id",        searchable: false, title: "Id",         order:0},
  {name: "firstName", searchable: true,  title: "First Name", order:1},
  {name: "lastName",  searchable: true,  title: "Last Name",  order:2},
  {name: "sex",       searchable: false, title: "Sex",        order:3},
  {name: "city",      searchable: true,  title: "City",       order:4},
  {name: "wage",      searchable: false, title: "Wage",       order:5},
  {name: "phone",     searchable: true,  title: "Phone",      order:6},
  {name: "date",      searchable: false, title: "Date",       order:7},
  {name: "children",  searchable: false, title: "Children",   order:8}
]


class App extends Component {

  render() {
    return (
      <div className="App">
        <NiceTable data-source="./data.json" fields={fields} />
      </div>
    );
  }
}

export default App;
