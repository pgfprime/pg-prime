import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    

    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search')

        
        setQuery('');
    };

    return(
        <Form className="d-flex" onSubmit={submitHandler}>
            <InputGroup>
                <FormControl 
                type="text" 
                name="q"
                value={query} 
                id="q" 
                onChange={(e) => setQuery(e.target.value)} 
                className="text-sm"
                placeholder="Search name"
                aria-label="Search Products"
                aria-describedby="button-search"
                
                 ></FormControl>
                 <Button className="border-white bg-black" type="submit" id="button-search" disabled={!query}>
                    <i className="fas fa-search"></i>
                 </Button>
            </InputGroup>
        </Form>
    )
}
export default SearchBox;