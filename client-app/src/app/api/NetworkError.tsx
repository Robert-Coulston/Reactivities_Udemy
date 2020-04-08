import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NetworkError = () => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
               Ok, the network is not responding...
            </Header>
        </Segment>
    );
};

export default NetworkError;