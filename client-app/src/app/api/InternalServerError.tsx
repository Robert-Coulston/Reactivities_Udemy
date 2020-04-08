import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const InternalServerError = () => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
               Ok, our fault, something on the server went pooof.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' primary>
                    Return to Activities page
                </Button>
            </Segment.Inline>
        </Segment>
    );
};

export default InternalServerError;
