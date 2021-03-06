import React from "react";
import PieChart from "../../Components/PieChart/PieChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import "./TradeVolumesGender.scss";

export const summaryQuery = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!){  
  categorySummary (
    fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"tradevolumes-category-gender"
    ){
      label
      value
    }
}
`);

export default class TradeVolumesGender extends React.Component {
  render() {
    return (
      <section id="tradeVolumesGender">
        <p className="title">TRADE VOLUMES BY GENDER</p>
        <Query
          query={summaryQuery}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender,
            txType: this.props.txType
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <p data-testid="loading">Loading data...</p>;
            } else if (error) {
              return (
                <p data-testid="apiError">
                  API returned an error Please try again
                </p>
              );
            } else {
              const chartData = data.categorySummary;
              if (chartData.length > 0) {
                return (
                  <PieChart
                    title={"Trade Volumes Gender"}
                    data={chartData}
                    width={250}
                    height={250}
                    diameter={175}
                    colors={["#3b5998", "#8b9dc3", "#536878", "#4279a3"]}
                  />
                );
              }
              return <p>There is no data for the current selection</p>;
            }
          }}
        </Query>
      </section>
    );
  }
}
