import React, { Component } from "react";
import { SaveBtn, ViewBtn, DeleteBtn } from "../components/Buttons";
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
      invalidEntry: false,
      books: [],
      title: "",
      saved: ""
      // author: ""
    };
  }
  

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ saved: res.data, title: ""})
      )
      .catch(err => console.log(err));
  };

  // deleteBook = id => {
  //   API.deleteBook(id)
  //     .then(res => this.loadBooks())
  //     .catch(err => console.log(err));
  // };

  saveBook = book => {
    API.saveBook({
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors[0],
      id: book.id,
      description: book.volumeInfo.description,
      image: book.volumeInfo.imageLinks.thumbnail,
      link: book.volumeInfo.previewLink
    }
    ).then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  linkBook = link => {
    window.open(link);
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value.replace(/ /g, '-')
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
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${this.state.title}&maxResults=20&key=${process.env.REACT_APP_GOOGLE_API}`)
      .then(res => res.json())
      .catch(err => console.log(err))
      .then(
        result => {
          // If results exist
          if(result.items){
            console.log(result)
            this.setState({
              isLoaded: true,
              books: result.items,
              invalidEntry: false
            })
          // If no results
          } else {
            this.setState({
              invalidEntry: true
            })
            console.log("invalid entry")
          }
        }
      )
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6 sm-12">
            {/* <Row> */}
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
              <ListItem>
                <Link to={"/saved"}>
                  <strong>
                    Go to Saved Books
                  </strong>
                </Link>
              </ListItem>
              {this.state.saved.length ? (
                <List>
                  {this.state.saved.map(book => (
                    <ListItem key={book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <h3></h3>
              )}
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
                    <SaveBtn onClick={() => this.saveBook(book)} />
                    <ViewBtn onClick={() => this.linkBook(book.volumeInfo.previewLink)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
            {this.state.invalidEntry && <h1>Invalid Entry</h1>}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Search;
