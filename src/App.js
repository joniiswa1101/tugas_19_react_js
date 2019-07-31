import React, { Component } from "react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";

class App extends Component {

  constructor(props){
    super(props);
    this.state={
      dataApi:[],
      edit:false,
      dataPost:{
        id:0,
        nama_karyawan:'',
        jabatan:'',
        jenis_kelamin:'',
        tanggal_lahir:''
      }
    };
    this.handleRemove=this.handleRemove.bind(this);
    this.inputChange=this.inputChange.bind(this);
    this.onSubmitForm=this.onSubmitForm.bind(this)
  };

  reloadData() {
    axios.get("http://localhost:3004/data-karyawan")
    .then(res => {
      this.setState({
        dataApi:res.data,
        edit:false
      })
    })
  }

  handleRemove(e){
    console.log(e.target.value);
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`,{method:'DELETE'})
    .then(res => this.reloadData());
  }

  inputChange(e) {
    let newdataPost = {...this.state.dataPost};
    if(this.state.edit === false){
      newdataPost['id'] = new Date().getTime();
    }

    newdataPost[e.target.name] = e.target.value;
    this.setState ({dataPost: newdataPost},()=>console.log(this.state.dataPost));
  }

  clearData =()=>{
    let newdataPost = {...this.state.dataPost};
    newdataPost['id'] ="";
    newdataPost['nama_karyawan']="";
    newdataPost['jabatan']="";
    newdataPost['jenis_kelamin']="";
    newdataPost['tanggal_lahir']=""

    this.setState ({
      dataPost: newdataPost
    });
  }

  onSubmitForm(){
    if (this.state.edit === false) {
      axios.post(`http://localhost:3004/data-karyawan`,this.state.dataPost).then(()=> {
        this.reloadData();
        this.clearData();
      });

    } else {
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost).then(()=>{
        this.reloadData();
        this.clearData();
      })
    };
  };

  getDataId=(e)=>{
      axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`).then(res=>{
        this.setState({
          dataPost:res.data,
          edit:true
        });
      });
  };

  componentDidMount() {
    // fetch('http://localhost:3004/data-karyawan')
    // .then(response => response.json())
    // .then(res => {
    //   this.setState({
    //     dataApi: res
    //   })
    // });
    this.reloadData();
  }

  render() {
    return (
      <div>
        <p>Data Karyawan</p>
        <input type="text" name='nama_karyawan' value={this.state.dataPost.nama_karyawan} placeholder='Masukkan Nama Karyawan' onChange={this.inputChange} />
        <input type="text" name='jabatan' value={this.state.dataPost.jabatan} placeholder='Masukkan Jabatan' onChange={this.inputChange}/>
        <input type="text" name='jenis_kelamin' value={this.state.dataPost.jenis_kelamin} placeholder='Masukkan Jenis Kelamin' onChange={this.inputChange}/>
        <input type="date" name='tanggal_lahir' value={this.state.dataPost.tanggal_lahir} placeholder='mm/dd/yy' onChange={this.inputChange}/>
        <button type="submit" onClick={this.onSubmitForm}>Save Data</button>

        {this.state.dataApi.map((dat, index) => {
          return (
            <div key={index}>
            <p>Nama : {dat.nama_karyawan}</p>
            <p>Jabatan : {dat.jabatan}</p>
            <p>Jenis Kelamin : {dat.jenis_kelamin}</p>
            <p>Tanggal Lahir : {dat.tanggal_lahir}</p>
            <Button primary value={dat.id} onClick={this.handleRemove}>Delete</Button>
            <Button color='red' value={dat.id} onClick={this.getDataId}>Edit Data</Button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
