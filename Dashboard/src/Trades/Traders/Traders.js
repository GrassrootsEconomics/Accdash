import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Table from "../../Components/Table/Table";
import { format } from "d3";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Traders.scss";

export const summaryQuery = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!){  
    summaryDataTopTraders (fromDate:$from, toDate:$to,  tokenName:$tokens, businessType:$spendTypes, gender:$gender){
     
      value
    }
}
`);

export default class Traders extends React.Component {
  render() {
    return (
      <section id="topTraders">
        <OverlayTrigger
          key={"bottom"}
          placement={"bottom"}
          overlay={
            <Tooltip id={`tooltip-bottom`}>
              {
                "Top 10 spenders for the given selection - Click on any row to go to Blockscout.com and see their transactions on the blockchain"
              }
            </Tooltip>
          }
        >
          <p className="title">TOP TRADERS</p>
        </OverlayTrigger>
        <Query
          query={summaryQuery}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender
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
              const chartData = data.summaryDataTopTraders[0].value;
              if (chartData.length > 0) {
                let tableData = data.summaryDataTopTraders[0].value.map(
                  (d, i) => ({
                    ...d,
                    Volume:
                      (d.volume >= 1 && d.volume < 100) || d.volume === 0
                        ? d.volume
                        : d.volume < 1
                        ? format(".3n")(d.volume)
                        : format(".3s")(d.volume),
                    TXs:
                      (d.count >= 1 && d.count < 100) || d.count === 0
                        ? d.count
                        : d.count < 1
                        ? format(".3n")(d.count)
                        : format(".3s")(d.count),
                    BusinessType: d.s_business_type,
                    Gender:
                      d.s_gender === "Male"
                        ? "M"
                        : d.s_gender === "Female"
                        ? "F"
                        : d.s_gender === "Unknown"
                        ? ""
                        : "Other",
                    url: `https://blockscout.com/poa/xdai/address/${d.source}/transactions`,
                    No: i + 1
                  })
                );
                return (
                  <Table
                    title={"Top Traders"}
                    keys={["No", "BusinessType", "Gender", "Volume", "TXs"]}
                    data={tableData}
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
