import React, { Component } from "react";
import { SaveBtn, ViewBtn, DeleteBtn } from "../components/Buttons";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

class Saved extends Component {
  state = {
    books: [],
    title: "",
    author: "",
    synopsis: ""
  };

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

  linkBook = link => {
    window.location.href = link;
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.title && this.state.author) {
      API.saveBook({
        title: this.state.title,
        author: this.state.author,
        synopsis: this.state.synopsis
      })
        .then(res => this.loadBooks())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            <ListItem>
              <Link to={"/search"}>
                <strong>
                  Find more books
                </strong>
              </Link>
            </ListItem>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                    <Button color="primary" id={"toggler"+book._id} style={{ marginBottom: '1rem' }}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Button>
                    <UncontrolledCollapse toggler={"#toggler"+book._id}>
                      <Card>
                        <CardBody>
                          <img src={book.image}></img>
                          <hr></hr>
                          Description: {book.description}
                        </CardBody>
                      </Card>
                    </UncontrolledCollapse>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                    <ViewBtn onClick={() => this.linkBook(book.link)} />
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

export default Saved;



