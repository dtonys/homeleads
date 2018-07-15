import React from 'react';
import { Header } from 'semantic-ui-react';


const Instructions = () => (
  <div>
    <Header as="h3"> Start collecting leads for your home </Header>
    <div style={{ textAlign: 'left' }} >
      <p> {'Please fill out the form on this page to signup to our service.'} </p>
      <p> {'First, enter your basic information.'} </p>
      <p> {`Next, enter the address of your home, and we'll look up your
              expected monthly rent for this property, fetched from Zillow.`}
      </p>
      <p> {`Finally, enter the rent you would like to associate with this property,
                    and hit the submit button to save this property and signup for our service.`}
      </p>
      <p> {'We\'ll save every property you search for, along with its expected monthly rent.'} </p>
    </div>
  </div>
);

export default Instructions;
