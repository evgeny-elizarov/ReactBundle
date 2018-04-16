import { React } from "@AndevisReactBundle/react";
import { PropTypes } from "@AndevisReactBundle/prop-types";
import { classNames } from "@AndevisReactBundle/helpers";

export default class PageLayout extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        header: PropTypes.any,
        toolbar: PropTypes.any,
        className: PropTypes.string,
    };

    render() {
        let sectionClassNames = classNames(this.props.className, 'page-section');
        return (
            <section className={sectionClassNames}>
                <div className="content-wrapper">
                    {
                        (this.props.title || this.props.toolbar || this.props.header) &&
                        this.props.header ? (
                            <div className="content-heading">{this.props.header}</div>
                        ) : (
                            <div className="content-heading clearfix">
                                {this.props.toolbar &&
                                <div className="btn-toolbar pull-right">{this.props.toolbar}</div>
                                }
                                <h1 className="title">{this.props.title}</h1>
                            </div>
                        )
                    }
                    {this.props.children}
                </div>
            </section>
        )
    }
}
