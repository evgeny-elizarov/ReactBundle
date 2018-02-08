import React from 'react';
import QueryResolveConfig from "../../graphql/QueryResolveConfig";
import MutationResolveConfig from "../../graphql/MutationResolveConfig";
import AutoCompleteTemplate from './AutoCompleteTemplate';

export default class AutoComplete extends Component
{
    constructor(props){
        super(props);
        this.state = {
            value: '',
            searchResults: [],
            loading: false
        };
    }

    resolveConfig(){
        return [
            new QueryResolveConfig(
                'search',
                'value: String!',
                'key, value'
            ),
            new MutationResolveConfig(
                'state',
                'value: String!',
            )
        ];
    }

    onChange(value){}

    onSearchResult(results){}

    eventChange(event){
        this.setState({ value: event.target.value });
        this.onChange(event.target.value);
        this.fireSearch(event.target.value);
    }

    eventSave(event){
        this.mutate.state({
            'value': this.state.value
        },(results) => {
            console.log(results);
        },(error) => {
            console.log(error);
        });
    }

    fireSearch(value){
        if(!this.state.loading)
        {
            this.setState({ loading: true });
            this.query.search({
                    'value': value
                },
                (results) => {
                    if(this._lastNotSearchedValue){
                        this.query.search({
                                'value': this._lastNotSearchedValue
                            },
                            (results) => {
                                this._lastNotSearchedValue = undefined;
                                this.setState({
                                    searchResults: results,
                                    loading: false
                                });
                                this.onSearchResult(results);
                            },
                            (error) => {
                                console.error(error);
                            }
                        );
                    } else {
                        this.setState({
                            searchResults: results,
                            loading: false
                        });
                        this.onSearchResult(results);
                    }
                },
                (error) => {
                    console.error(error);
                }
            );
        } else {
            this._lastNotSearchedValue = value;
        }
    }

    render(){
        return AutoCompleteTemplate.render({
            value: this.state.value,
            searchResults: this.state.searchResults,
            eventChange: this.eventChange.bind(this),
            eventSave: this.eventSave.bind(this)
        });
    }
}