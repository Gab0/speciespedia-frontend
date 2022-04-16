import React from 'react';
import { RemoteResult, SpeciesInformation } from './Types.ts'
import backendRequest from './Backend.js';

function taxonomyField(fieldname: String, fieldvalue: String) {
  if (fieldvalue) {
    return (
      <div>
      <div className="taxonomy-category centering">
        { fieldname }
      </div>
      <div className="taxonomy-value centering">
        { fieldvalue }
      </div>
      </div>
    )
  } else return <div></div>

}

function extraInformation(fieldname: String, fieldvalue: String) {
  if (fieldvalue) {
    return (
      <div className="extra-info-div">
        <div className="extra-info-title">
          {fieldname}
        </div>
        <div className="extra-info-text">
          { fieldvalue }
        </div>
      </div>
    )
  } else return <div></div>

}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function extractConservationStatus(statuses: string[]): string {
  return statuses.filter(onlyUnique).join(", ")
}

function extractVernacularNames(vernacular: VernacularName[]): string {
  return vernacular.map(v => v.vernacularNameVernacularName).join(", ")
}

class TaxonomyDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.taxonomy_fields = [
      "Kingdom",
      "Phylum",
      "Order",
      "Genus",
      "Family"
    ]

  }

  displaySpeciesTaxonomy(taxonomy: SpeciesInformation) {
    return (
      this.taxonomy_fields.map(field => taxonomyField(
        field,
        this.processTaxonomyField(taxonomy["speciesInformation" + field]))
    )
    )

    }
  processTaxonomyField(value: String) {
    if (value == null) return "-"
    return value
  }

  render() {
    try {
      var k = this.props.readContent().remoteResultInformation;
    } catch(e) {
      console.log(e);
    }
    return (
      <div>
        { this.displaySpeciesTaxonomy(k) }
      </div>
    )
  }

}

class SpeciesDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.display = this.display.bind(this);
  }

  displayImage(url) {
    return <img src={url} alt="Visual depiction."></img>
  }

  display() {
    try {
      var content = this.props.readContent();
      //return JSON.stringify(obj)
      return (
        <div className="main">

        <div className="side-panel">
          <TaxonomyDisplay
            taxonomyInfo={content.remoteResultSpeciesInformation}
            readContent={this.props.readContent}
          />
        </div>
        <div className="main-panel">

          <div>
            { content.remoteResultImages.slice(0, 16).map(this.displayImage) }
          </div>

          <div>
            <div className="float">
              { extraInformation(
                "Conservation status",
                extractConservationStatus(
                  content.remoteResultInformation.speciesInformationStatuses
                ))
              }
            </div>
            <div>
                { extraInformation(
                  "Popular names",
                  extractVernacularNames(
                    content.remoteResultInformation.speciesInformationVernacularNames))
                }
            </div>
            </div>
          <div>
            <br/>
            </div>
        <div className="wikipedia-text">
          {content.remoteResultWikipedia}
        </div>
        </div>
        </div>
      )

    } catch (e) {
      console.log('Error ', e)
      return (
        <div>
        <p>This application searches for information about species in the internet.</p>
          <p>Query for a species name such as Felis catus.</p>
        </div>
      )
    };

  }

  render() {
    return (
      <div className="main">
        <p>{this.props.readQuery()}</p>
        {this.display()}
      </div>
    );
  }
}


class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {query: ""};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    var k = event.target.value;
    this.props.updateQuery(k);
    this.setState({query: k});
  }

  render() {
    return (
      <div className="search-form centering">
      <form onSubmit={this.props.handleSubmit}>
        <label>
          Search:
          <input type="text" value={this.state.query} onChange={this.handleChange} />
        </label>
        <input type="submit" className="search-btn" value="Submit" />
      </form>
      </div>
    );
  }
}



class Encyclopedia extends React.Component {
  constructor(props) {
    super(props);

    this.state = {query: '', content: {}};
  }

  readContent() {
    return this.state.content;
  }

  readQuery() {
    return this.state.query;
  }

  updateQuery(query_string) {
    this.setState({query: query_string});
  }

  handleSubmit(event) {
    event.preventDefault();

    var query = this.readQuery();
    console.log("Sending request:", query);

    var data = {
      queryContent: query,
      jsonResponse: false
    }
    console.log(data);

    // PREPARE SEARCH REQUEST;
    // LOAD REMOTE DATA:

    backendRequest('/search.json', data)
        .then((response) => {
          var content = response.data
          var err: RemoteResult = content.Left;
          if (err) {
            console.log("Search request error:", err);
            return
          }
          var res: RemoteResult = content.Right;

          console.log("Search request OK.");
          console.log(res);

          this.setState({query: this.state.query, content: res});

        });
  }

  render() {
    return <div className="centering">
             <SearchForm
               handleSubmit={this.handleSubmit.bind(this)}
               updateQuery={this.updateQuery.bind(this)}
             />
             <SpeciesDisplay
               readContent={this.readContent.bind(this)}
               readQuery={this.readQuery.bind(this)}
             />
           </div>
  }
}

export default Encyclopedia;
