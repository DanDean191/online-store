import React, { useEffect, useState } from 'react'
import { Sticky, Header, Segment, Breadcrumb, Container, Menu, Dropdown, Search, Grid } from 'semantic-ui-react'
import './Header.scss'
import { Link, useLocation } from 'react-router-dom'

import { selectAllCategories, selectAllProductsFromSearch } from '../products/productsSlice'
import { useSelector } from 'react-redux'

const Navbar = () => {
    const { pathname } = useLocation()
    const [links, setLinks] = useState([])
    const [search, setSearch] = useState('')

    const allCategories = useSelector(selectAllCategories)

    useEffect(() => {
        const pathItems = pathname.split('/').slice(1)
        setLinks(pathItems)
    }, [pathname])

    const searchResults = useSelector((state) => selectAllProductsFromSearch(state, search)) 
    console.log(searchResults)

    const breadcrumbs = links.map((link,index) => {
        if (index === links.length-1) return <span key={index}><Breadcrumb.Section className="breadcrumb-text">{decodeURIComponent(link)}</Breadcrumb.Section></span>
        
        const url = links.slice(0,index+1).join('/')

        return (
            <span key={index}>
                <Breadcrumb.Section as={Link} to={url} className="breadcrumb-text">{decodeURIComponent(link)}</Breadcrumb.Section>
                <Breadcrumb.Divider />
            </span>
        )
    })

    const dropdownMenu = () => {
        const dropdownItems = allCategories.map((category, index) => <Dropdown.Item key={index} as={Link} to={`Products/${category}`} >{category}</Dropdown.Item>)

        return (
            <Menu compact>
                <Dropdown text='Category' simple item >
                    <Dropdown.Menu>
                        {dropdownItems}
                    </Dropdown.Menu>
                </Dropdown>
            </Menu>
        ) 
    }

    const resultRenderer = (product) => {
        console.log(product)

        const {id, title, category} = product


        //console.log(title) ;


        return <Header as={Link} to={`products/${category}/${id+1}`} content={title} /> 
    }

    return (
        <Sticky active >
            <Segment inverted textAlign="center" basic attached>
                <Header as='h1'>Online Store</Header>
                {dropdownMenu()}
                <Grid centered>
                    <Search
                        aligned={'center'}
                        placeholder='Search...'
                        onSearchChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        resultRenderer={resultRenderer}
                        results={searchResults}
                        // value={value}
                    />
                </Grid>

            </Segment>
            { links[0] !== '' && <Segment textAlign="left" attached>
                <Container>
                    <Breadcrumb>
                        <Breadcrumb.Section as={Link} to={'/'}>Home</Breadcrumb.Section>
                        <Breadcrumb.Divider/>
                        {breadcrumbs}
                    </Breadcrumb>
                </Container>
            </Segment> }
        </Sticky>
    )
}

export default Navbar