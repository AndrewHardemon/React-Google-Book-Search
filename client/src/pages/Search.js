import React, { Component } from "react";
import { SaveBtn, ViewBtn } from "../components/Buttons";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      error: null,
      isLoaded: false,
      books: [],
      title: ""
      // author: "",
      // synopsis: ""
    };
  }
  
  // state = {
  //  error: null,
  //  isLoaded: false,
  //   books: [],
  //   title: "",
  //   author: "",
  //   synopsis: ""
  // };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  // deleteBook = id => {
  //   API.deleteBook(id)
  //     .then(res => this.loadBooks())
  //     .catch(err => console.log(err));
  // };

  saveBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };
  linkBook = link => {
    window.location.href = link;
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    // Remove old books
    this.setState({
      isLoaded: false,
      books: {}
    })
    // Add new books
    fetch(`https://www.googleapis.com/books/v1/volumes?q=flowers&key=${process.env.REACT_APP_GOOGLE_API}`)
      .then(res => res.json())
      .then(
        result => {
          console.log(result)
          this.setState({
            isLoaded: true,
            books: result.items
          })
        }
      )
      // title: result.items.volumeInfo.title,
      // author: result.items.volumeInfo.authors,
      // id: result.items.id,
      // description: result.items.volumeInfo.subtitle,
      // image: result.items.volumeInfo.imageLinks.thumbnail,
      // link: result.items.selfLink
    // if (this.state.title && this.state.author) {
    //   API.saveBook({
    //     title: this.state.title,
    //     author: this.state.author,
    //     synopsis: this.state.synopsis
    //   })
    //     .then(res => this.loadBooks())
    //     .catch(err => console.log(err));
    // }
    console.log(this.state.books)
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>Find a Book!</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Title (required)"
              />
              {/* <Input
                value={this.state.author}
                onChange={this.handleInputChange}
                name="author"
                placeholder="Author (required)"
              /> */}
              <FormBtn
                disabled={!(this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book.id}>
                    {/* <Link to={"/books/" + book.id}> */}
                    <Button color="primary" id={"toggler"+book.id} style={{ marginBottom: '1rem' }}>
                      <strong>
                        {book.volumeInfo.title} by {book.volumeInfo.authors}
                      </strong>
                    </Button>
                    <UncontrolledCollapse toggler={"#toggler"+book.id}>
                      <Card>
                        <CardBody>
                          <img src={book.volumeInfo.imageLinks.thumbnail}></img>
                          <hr></hr>
                          Description: {book.volumeInfo.description}
                        </CardBody>
                      </Card>
                    </UncontrolledCollapse>
                    {/* </Link> */}
                    <SaveBtn onClick={() => this.saveBook(book.id)} />
                    <ViewBtn onClick={() => this.linkBook(book.previewLink)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Search;
