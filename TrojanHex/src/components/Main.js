import React, { Component } from 'react';
import ipfs from './ipfs';

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ipfsHash: "",
      image: null
    }
    this.captureFile = this.captureFile.bind(this)
  }
  captureFile(event) {
    event.preventDefault()
    const target = event.target;
    const file_name = target.id
    const file = target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      if(file_name === 'productImage'){
        console.log(file_name)
        this.setState({ image: Buffer(reader.result)})
        ipfs.files.add( this.state.image, (error, result) => {
          if(error){
            console.error(error)
            return
          }
          this.setState({ ipfsHash: result[0].hash })
        })
      } 
    }
  }
  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          const image = this.state.ipfsHash
          this.props.createProduct(name, price, image)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              onChange={this.captureFile} 
              id="productImage"
              type="file"
              className="form-control"
              placeholder="Product Image"
              required />
              <label htmlFor="productImage"><img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="First" height="100" /></label>
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td><img src={`https://ipfs.io/ipfs/${product.image}`} alt="First" height="100" /></td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Hex</td>
                  <td>{product.owner}</td>
                  <td>
                    { this.props.account === product.owner
                      ? <h6>This is yours</h6>
                      :!product.purchased
                        ? <button
                            name={product.id}
                            value={product.price}
                            onClick={(event) => {
                              this.props.purchaseProduct(event.target.name, event.target.value)
                            }}
                          >
                            Buy
                          </button>
                        : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main