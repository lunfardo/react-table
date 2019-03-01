import React from 'react';
import './NiceTable.css';


class NiceTable extends React.Component {
  state = {
    data : [],
    searchString: "",
    pageNumber: 0,
    recordsPerPage: 20,
    hiddenColumns : []
  }

  async getDataFromDataSource() {
    let dataURL = this.props["data-source"];
    let response = await fetch(dataURL);
    let dataJSON = await response.json();
    this.setState({ data: dataJSON });
  }

  componentWillMount() {
    this.getDataFromDataSource();
  }

  handleChangeSearchString(event) {
    this.setState({searchString: event.target.value});
  }

  handleChangeRecordsPerPage(event) {
    this.setState({recordsPerPage: parseInt(event.target.value)});
  }

  handleSortChange(event) {
    console.log(event);
    if(event.dir == "INC") {
    this.setState({data: this.state.data.sort((a,b) =>
      (a[event.fieldName] > b[event.fieldName]) ? 1 :
      ((b[event.fieldName] > a[event.fieldName]) ? -1 : 0) 
    )});
    }

    if(event.dir == "DESC") {
      this.setState({data: this.state.data.sort((a,b) =>
        (a[event.fieldName] < b[event.fieldName]) ? 1 :
        ((b[event.fieldName] < a[event.fieldName]) ? -1 : 0) 
      )});      
    }

  }

  handlePageChange(event) {
    if (event.dir == "DESC") {
      if (this.state.pageNumber == 0) {
        alert("you are in the first page");
        return null;
      }
      this.setState({pageNumber: this.state.pageNumber - 1});
    }

    if(event.dir == "INC") {
      this.setState({pageNumber: this.state.pageNumber + 1});
    }
  }

  handleHideColumnBtn(event) {
    if(! this.state.hiddenColumns.includes(event.fieldName)) {
      this.setState({hiddenColumns: this.state.hiddenColumns.concat([event.fieldName])});
    }
  }

  handleShowAllColumsBtn(event) {
    this.setState({hiddenColumns: []});
  }

  renderHeader() {
    return (
      <thead>
        <tr>
          {this.props.fields.map((field) => 
          this.state.hiddenColumns.includes(field.name)?  null : 
          <td>
            {field.title}
            <button className="hidde-button" onClick={this.handleHideColumnBtn.bind(this,{fieldName: field.name})}>Hide</button>
            <div className="sort-buttons-wrapper">
              <div onClick={this.handleSortChange.bind(this,{fieldName: field.name, dir:"DESC"})}>🠕</div>
              <div onClick={this.handleSortChange.bind(this,{fieldName: field.name, dir:"INC"})}>🠗</div>
            </div>
          </td>)}
        </tr>
      </thead>      
    )
  }

  renderTopTools() {
    return (
      <div className="nice-table-toolbox">
        Search : <input type="text" placeholder="Search" value={this.state.searchString} onChange={this.handleChangeSearchString.bind(this)}/>
        Records per Page : <input type="text" value={this.state.recordsPerPage} onChange={this.handleChangeRecordsPerPage.bind(this)}/>
        <button className="show-all-colums-btn" onClick={this.handleShowAllColumsBtn.bind(this)}>Show All Columns!</button>
      </div>      
    )
  }

  renderPagination() {
    return (
      <div>
        <button onClick={this.handlePageChange.bind(this,{dir:"DESC"})}>🠐</button>
         Page: {this.state.pageNumber}
        <button onClick={this.handlePageChange.bind(this,{dir:"INC"})}>🠒</button>
      </div>      
    )    
  }

  filterBySearch(rowData) {
    if (this.state.searchString == 0) return true;
    let pattern = this.state.searchString.toUpperCase();
    
    let aux = false;
    for (let field of this.props.fields) {
      if(field.searchable) {
        if (rowData[field.name].toUpperCase().includes(pattern)){
          aux = true;
          break;
        }
      }
    }
    return aux;
  }

  filterByPaging(rowData, index) {
    let floor = this.state.pageNumber * this.state.recordsPerPage;
    let ceil  = floor + this.state.recordsPerPage;
    return (index >= floor) && (index < ceil);
  }

  printRow(rowData, index) {
    return (
      <tr key={index}>
      {this.props.fields.map(
        (field) => 
            this.state.hiddenColumns.includes(field.name)?  null : 
            <td className= {index % 2 == 1? 'odd-row':''}>{rowData[field.name]}</td>
      )}
      </tr>
    )
  }

  render() {
      return (
        <div id="nice-table-wrapper">

          {this.renderTopTools()}

          <table id="nice-main-table">
            {this.renderHeader()}
            <tbody>
              {this.state.data
              .filter(this.filterBySearch.bind(this))
              .filter(this.filterByPaging.bind(this))
              .map(this.printRow.bind(this))}
            </tbody>
          </table> 

          {this.renderPagination()}

        </div>
      );
  }
}

export default NiceTable;