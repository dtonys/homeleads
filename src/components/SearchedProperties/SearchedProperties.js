import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Table,
} from 'semantic-ui-react';
import { getRentRange } from 'helpers/util';


const SearchedProperties = ({
  searchHistory,
}) => (
  <div>
    <Header as="h3"> Searched Properties </Header>
    <Table celled compact="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Property</Table.HeaderCell>
          <Table.HeaderCell>Rent Min</Table.HeaderCell>
          <Table.HeaderCell>Rent Max</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { searchHistory.map(( [ street, suggestedMonthlyRent ], index ) => {
          const [ rentMin, rentMax ] = getRentRange(suggestedMonthlyRent);
          return (
            <Table.Row key={ index } >
              <Table.Cell>{street}</Table.Cell>
              <Table.Cell>{rentMin}</Table.Cell>
              <Table.Cell>{rentMax}</Table.Cell>
            </Table.Row>
          );
        }) }
      </Table.Body>
    </Table>
  </div>
);
SearchedProperties.propTypes = {
  searchHistory: PropTypes.array.isRequired,
};

export default SearchedProperties;

